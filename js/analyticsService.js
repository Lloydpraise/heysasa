// =========================================================================
// CENTRALIZED ANALYTICS DATA SERVICE (DATABASE AGGREGATOR)
// =========================================================================

window.analyticsService = {
    /**
     * Pulls data from views and core tables in parallel, processing them
     * into exact matching structures required by the frontend charts.
     * @param {string} businessId - The active 8-character business identifier
     */
    getDashboardMetrics: async (businessId) => {
        const client = window.getSupabase();
        if (!client) {
            console.error("[Analytics Service] Supabase client is uninitialized.");
            return null;
        }

        try {
            console.log(`[Analytics] Fetching real-time records for: ${businessId}`);

            // Execute parallel queries across views and tables to minimize overhead
            const [leadsResponse, adsResponse, messagesResponse] = await Promise.all([
                client
                    .from('v_lead_summary')
                    .select('*')
                    .eq('business_id', businessId),

                client
                    .from('v_ad_leaderboard')
                    .select('*')
                    .eq('business_id', businessId)
                    .limit(5),

                client
                    .from('messages')
                    .select('conversation_id, created_at, role, direction')
                    .eq('business_id', businessId)
                    .order('created_at', { ascending: true })
            ]);

            if (leadsResponse.error)   throw leadsResponse.error;
            if (adsResponse.error)     throw adsResponse.error;
            if (messagesResponse.error) throw messagesResponse.error;

            const rawLeads    = leadsResponse.data    || [];
            const rawAds      = adsResponse.data      || [];
            const rawMessages = messagesResponse.data || [];

            // ─── 1. PIPELINE STATES & FUNNEL CALCULATIONS ───────────────────
            const pipeline = {
                new: 0, engaged: 0, warm: 0, stalled: 0,
                won: 0, lost: 0, ghosted: 0, do_not_contact: 0
            };
            let totalUnread  = 0;
            let totalOptOuts = 0;

            rawLeads.forEach(lead => {
                if (pipeline[lead.lead_state] !== undefined) {
                    pipeline[lead.lead_state]++;
                }
                if (lead.unread_count > 0) {
                    totalUnread += lead.unread_count;
                }
                if (lead.do_not_contact) {
                    totalOptOuts++;
                }
            });

            // Compile the 5 stages exactly as analytics.js maps them
            const funnelArray = [
                { stage: 'Total contacts',  count: rawLeads.length },
                { stage: 'Business leads',  count: rawLeads.filter(l => l.lead_state !== 'do_not_contact').length },
                { stage: 'Replied',         count: (pipeline.engaged + pipeline.warm + pipeline.stalled + pipeline.won + pipeline.ghosted) },
                { stage: 'Showed interest', count: (pipeline.warm + pipeline.won) },
                { stage: 'Converted',       count: pipeline.won }
            ];

            const stateBreakdownArray = [
                { state: 'engaged', count: pipeline.engaged, label: 'Engaged'    },
                { state: 'new',     count: pipeline.new,     label: 'New'        },
                { state: 'stalled', count: pipeline.stalled, label: 'Going cold' },
                { state: 'ghosted', count: pipeline.ghosted, label: 'Ghosted'    },
                { state: 'won',     count: pipeline.won,     label: 'Won'        }
            ];

            // ─── 2. AD LEADERBOARD MAPPING ──────────────────────────────────
            const adLeaderboardArray = rawAds.map(ad => ({
                ad_id:                  ad.ad_id,
                platform:               ad.ad_platform             || 'facebook',
                headline:               ad.ad_headline             || 'No Headline',
                body:                   ad.ad_body_preview         || 'No description preview available.',
                thumbnail:              ad.ad_thumbnail_url        || 'https://placehold.co/56x56/94A3B8/ffffff?text=AD',
                lead_count:             ad.lead_count              || 0,
                reply_count:            ad.reply_count             || 0,
                product_interest_count: ad.product_interest_count  || 0,
                conversion_count:       ad.conversion_count        || 0,
                quality_score:          ad.quality_score           || 0
            }));

            // ─── 3. PRODUCT DEMAND EXTRACTION ───────────────────────────────
            const productCounts = {};
            rawLeads.forEach(lead => {
                if (Array.isArray(lead.product_interests)) {
                    lead.product_interests.forEach(product => {
                        if (product) {
                            productCounts[product] = (productCounts[product] || 0) + 1;
                        }
                    });
                }
            });

            const productDemandArray = Object.entries(productCounts)
                .map(([label, count]) => ({ label, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            if (productDemandArray.length === 0) {
                productDemandArray.push({ label: 'No data recorded', count: 0 });
            }

            // ─── 4. 7x24 HEATMAP MATRIX & AI AUTOMATION RATIOS ──────────────
            const heatmapMatrix = Array.from({ length: 7 }, () => Array(24).fill(0));
            let aiCount    = 0;
            let humanCount = 0;

            // For avg reply time: map first inbound message ts per conversation
            // then find the first outbound reply and compute the delta
            const firstInbound  = {}; // conversation_id -> Date
            const firstOutbound = {}; // conversation_id -> Date

            rawMessages.forEach(msg => {
                if (!msg.created_at) return;

                const dateObj = new Date(msg.created_at);
                let day = dateObj.getDay() - 1; // Mon=0 ... Sun=6
                if (day < 0) day = 6;           // Sunday wraps to index 6
                const hour = dateObj.getHours();

                if (day >= 0 && day < 7 && hour >= 0 && hour < 24) {
                    heatmapMatrix[day][hour]++;
                }

                if (msg.direction === 'out') {
                    if (msg.role === 'ai')    aiCount++;
                    if (msg.role === 'admin') humanCount++;
                }

                // Track first inbound per conversation for reply-time calc
                if (msg.direction === 'in') {
                    const cid = msg.conversation_id;
                    if (!firstInbound[cid]) {
                        firstInbound[cid] = dateObj;
                    }
                }

                // Track first outbound per conversation
                if (msg.direction === 'out') {
                    const cid = msg.conversation_id;
                    if (!firstOutbound[cid]) {
                        firstOutbound[cid] = dateObj;
                    }
                }
            });

            // ─── 4a. AVG REPLY TIME CALCULATION ─────────────────────────────
            // For each conversation that has both an inbound and an outbound,
            // compute the gap in minutes. Average across all such conversations.
            const replyDeltas = [];
            Object.keys(firstInbound).forEach(cid => {
                if (firstOutbound[cid]) {
                    const diffMs = firstOutbound[cid] - firstInbound[cid];
                    if (diffMs > 0) {
                        replyDeltas.push(diffMs / (1000 * 60)); // convert to minutes
                    }
                }
            });

            const avgReplyTimeMin = replyDeltas.length > 0
                ? Math.round(replyDeltas.reduce((sum, d) => sum + d, 0) / replyDeltas.length)
                : 0;

            const totalOutbound    = aiCount + humanCount;
            const pctAiManaged     = totalOutbound > 0 ? Math.round((aiCount / totalOutbound) * 100) : 0;
            const pctNeverReplied  = rawLeads.length > 0 ? Math.round((pipeline.new     / rawLeads.length) * 100) : 0;
            const pctGoneCold      = rawLeads.length > 0 ? Math.round((pipeline.stalled / rawLeads.length) * 100) : 0;

            const convHealthObject = {
                avg_reply_time_min: avgReplyTimeMin,
                pct_never_replied:  pctNeverReplied,
                pct_gone_cold:      pctGoneCold,
                pct_ai_managed:     pctAiManaged,
                open_unread:        totalUnread,
                opt_out_count:      totalOptOuts
            };

            // ─── 5. WEEKLY LEAD TRENDS (PAST 8 WEEKS) ───────────────────────
            const weeklyTrendArray = Array.from({ length: 8 }, (_, i) => ({
                week: `W${i + 1}`,
                new:  0
            }));

            const now = new Date();
            rawLeads.forEach(lead => {
                const dateField = lead.ad_attributed_at || lead.last_seen;
                if (!dateField) return;

                const leadDate = new Date(dateField);
                const diffTime = now - leadDate;
                if (diffTime < 0) return; // future-dated rows — skip

                const diffDays  = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const weekIndex = 8 - Math.ceil(diffDays / 7);

                if (weekIndex >= 0 && weekIndex < 8) {
                    weeklyTrendArray[weekIndex].new++;
                }
            });

            // ─── Return payload structured for UI assignment ─────────────────
            return {
                funnel:         funnelArray,
                stateBreakdown: stateBreakdownArray,
                adLeaderboard:  adLeaderboardArray,
                productDemand:  productDemandArray,
                convHealth:     convHealthObject,
                heatmap:        heatmapMatrix,
                weeklyTrend:    weeklyTrendArray
            };

        } catch (error) {
            console.error("[Analytics Service] Failed compilation processing:", error);
            return null;
        }
    }
};