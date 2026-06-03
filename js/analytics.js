// ─── Analytics data ───────────────────────────────────────────────────────────
let analyticsData = {
    funnel: [
        { stage: 'Total contacts',    count: 6  },
        { stage: 'Business leads',    count: 5  },
        { stage: 'Replied',           count: 4  },
        { stage: 'Showed interest',   count: 4  },
        { stage: 'Converted',         count: 1  },
    ],
    stateBreakdown: [
        { state: 'engaged',  count: 1, label: 'Engaged' },
        { state: 'new',      count: 2, label: 'New' },
        { state: 'stalled',  count: 1, label: 'Going cold' },
        { state: 'ghosted',  count: 1, label: 'Ghosted' },
        { state: 'won',      count: 1, label: 'Won' },
    ],
    adLeaderboard: [
        {
            ad_id: 'fb_ad_001', platform: 'facebook',
            headline: 'Power Your Home 24/7 — Solar Backup Systems',
            body: 'Never lose power again. Our 5kW inverter keeps you running.',
            thumbnail: 'https://placehold.co/56x56/28A745/ffffff?text=AD',
            lead_count: 4, reply_count: 3, product_interest_count: 3, conversion_count: 1, quality_score: 58,
        },
        {
            ad_id: 'ig_ad_002', platform: 'instagram',
            headline: 'Rent Furnished Apartments in Westlands',
            body: '1, 2 & 3 bedroom fully furnished. From KES 45,000/month.',
            thumbnail: 'https://placehold.co/56x56/94A3B8/ffffff?text=AD',
            lead_count: 1, reply_count: 1, product_interest_count: 1, conversion_count: 0, quality_score: 36,
        },
    ],
    productDemand: [
        { label: 'Solar energy',       count: 4 },
        { label: 'Real estate',        count: 1 },
        { label: 'Financial services', count: 1 },
    ],
    convHealth: {
        avg_reply_time_min: 12,
        pct_never_replied:  17,
        pct_gone_cold:      20,
        pct_ai_managed:     60,
        open_unread:         2,
        opt_out_count:       0,
    },
    heatmap: (() => {
        const g = Array.from({ length: 7 }, () => Array(24).fill(0));
        const peaks = [
            [0,9,3],[0,10,4],[0,14,2],[1,9,3],[1,20,4],[1,21,3],
            [2,8,2],[2,10,4],[2,19,3],[3,10,3],[3,11,3],[4,9,4],
            [4,16,3],[5,11,4],[5,20,5],[5,21,4],[6,10,3],[6,14,4],[6,20,5],
        ];
        peaks.forEach(([d,h,v]) => { g[d][h] = v; });
        return g;
    })(),
    weeklyTrend: [
        { week: 'W1', new: 0 }, { week: 'W2', new: 1 }, { week: 'W3', new: 0 },
        { week: 'W4', new: 2 }, { week: 'W5', new: 1 }, { week: 'W6', new: 0 },
        { week: 'W7', new: 1 }, { week: 'W8', new: 3 },
    ],
};

let activeAnSection = 'overview';

// ─── Style injection ──────────────────────────────────────────────────────────
function injectAnalyticsStyles() {
    if (document.getElementById('analytics-styles')) return;
    const s = document.createElement('style');
    s.id = 'analytics-styles';
    s.textContent = `
        /* Layout */
        .an-wrap { display:flex; flex-direction:column; width:100%; height:100%; position:relative; }
        
        /* Drawer/Modal System */
        .an-drawer-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.2); backdrop-filter:blur(4px); opacity:0; pointer-events:none; transition:opacity 0.3s ease; z-index:100; }
        .an-drawer-overlay.open { opacity:1; pointer-events:all; }
        .an-drawer-panel { position:fixed; top:0; right:0; height:100%; width:450px; max-width:100vw; background:rgba(255,255,255,0.85); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border-left:1px solid rgba(255,255,255,0.9); box-shadow:-10px 0 40px rgba(0,0,0,0.05); transform:translateX(100%); transition:transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index:101; display:flex; flex-direction:column; }
        .an-drawer-panel.open { transform:translateX(0); }
        .an-drawer-header { padding:24px; border-bottom:1px solid rgba(15,23,42,0.05); display:flex; align-items:center; justify-content:space-between; }
        .an-drawer-title { font-size:18px; font-weight:700; color:#0F172A; }
        .an-drawer-close { background:rgba(15,23,42,0.05); border:none; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#64748B; transition:all 0.2s; }
        .an-drawer-close:hover { background:rgba(15,23,42,0.1); color:#0F172A; }
        .an-drawer-body { flex:1; overflow-y:auto; padding:24px; }

        /* Typography & Utilities */
        .txt-slate { color:#0F172A; }
        .txt-muted { color:#64748B; }
        .txt-brand { color:#28A745; }
        
        /* Info Tooltips */
        .info-btn { color:#94A3B8; cursor:pointer; position:relative; display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; margin-left:6px; transition:color 0.2s; }
        .info-btn:hover { color:#28A745; }
        .info-btn svg { width:14px; height:14px; }
        .info-btn .tooltip { visibility:hidden; width:220px; background:#0F172A; color:#fff; text-align:center; border-radius:8px; padding:8px 12px; position:absolute; z-index:100; bottom:130%; left:50%; transform:translateX(-50%); font-size:11px; font-weight:500; line-height:1.4; box-shadow:0 10px 25px rgba(0,0,0,0.15); opacity:0; transition:all 0.2s; white-space:normal; pointer-events:none; }
        .info-btn:hover .tooltip { visibility:visible; opacity:1; bottom:150%; }
        .info-btn .tooltip::after { content:""; position:absolute; top:100%; left:50%; margin-left:-4px; border-width:4px; border-style:solid; border-color:#0F172A transparent transparent transparent; }

        /* Navigation */
        .an-topnav { display:flex; align-items:center; gap:8px; padding-bottom:16px; border-bottom:1px solid rgba(15,23,42,0.05); flex-shrink:0; margin-bottom:20px; overflow-x:auto; }
        .an-topnav::-webkit-scrollbar { display:none; }
        .an-tab { display:flex; align-items:center; gap:8px; padding:10px 18px; border-radius:12px; font-size:13px; font-weight:600; color:#64748B; cursor:pointer; background:transparent; transition:all 0.2s; border:1px solid transparent; white-space:nowrap; }
        .an-tab:hover { color:#1E293B; background:rgba(255,255,255,0.4); }
        .an-tab.active { background:rgba(255,255,255,0.8); color:#0F172A; box-shadow:0 2px 10px rgba(0,0,0,0.02); border-color:rgba(255,255,255,0.9); }
        .an-tab.active::before { content:''; position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:12px; background-color:#FF8C00; border-radius:4px; }
        .an-tab svg { width:16px; height:16px; }

        /* Content Area */
        .an-content { flex:1; overflow-y:auto; padding-right:8px; padding-bottom:24px; display:flex; flex-direction:column; gap:20px; }
        .an-content::-webkit-scrollbar { width:6px; }
        .an-content::-webkit-scrollbar-thumb { background:rgba(15,23,42,0.1); border-radius:10px; }
        
        /* Premium Glass Box */
        .glass-box { background:rgba(255,255,255,0.6); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.9); box-shadow:0 4px 20px rgba(0,0,0,0.02); border-radius:1.25rem; padding:24px; transition:transform 0.2s ease, box-shadow 0.2s ease; }
        .glass-box.interactive:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,0,0,0.04); cursor:pointer; }
        
        /* Grids */
        .grid-cards { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; }
        .grid-2col { display:grid; grid-template-columns:repeat(auto-fit, minmax(400px, 1fr)); gap:20px; }

        /* Hero Stats */
        .hero-num { font-size:36px; font-weight:800; color:#0F172A; line-height:1; margin-bottom:8px; }
        .hero-lbl { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#64748B; display:flex; align-items:center; }
        .hero-sub { font-size:12px; color:#94A3B8; margin-top:6px; font-weight:500; }
        .status-dot { width:8px; height:8px; border-radius:50%; display:inline-block; margin-right:6px; }
        .status-dot.green { background:#28A745; box-shadow:0 0 8px rgba(40,167,69,0.4); }
        .status-dot.amber { background:#FF8C00; box-shadow:0 0 8px rgba(255,140,0,0.4); }
        .status-dot.red { background:#EF4444; box-shadow:0 0 8px rgba(239,68,68,0.4); }

        /* Section Titles */
        .section-header { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#64748B; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
        .section-header svg { width:18px; height:18px; color:#94A3B8; }

        /* Funnel & Bars */
        .bar-row { display:flex; align-items:center; gap:16px; margin-bottom:14px; }
        .bar-row:last-child { margin-bottom:0; }
        .bar-label { width:130px; flex-shrink:0; font-size:13px; color:#0F172A; font-weight:600; }
        .bar-outer { flex:1; height:24px; background:rgba(15,23,42,0.04); border-radius:12px; overflow:hidden; }
        .bar-inner { height:100%; border-radius:12px; display:flex; align-items:center; justify-content:flex-end; padding-right:12px; transition:width 0.8s cubic-bezier(0.4,0,0.2,1); background:#28A745; }
        .bar-val { font-size:12px; font-weight:700; color:#fff; }
        .bar-pct { width:40px; text-align:right; font-size:13px; font-weight:700; color:#64748B; }

        /* Ad Cards */
        .ad-item { display:flex; gap:16px; padding:16px; border-radius:16px; background:rgba(255,255,255,0.4); border:1px solid rgba(255,255,255,0.6); margin-bottom:12px; transition:all 0.2s; cursor:pointer; }
        .ad-item:hover { background:rgba(255,255,255,0.8); box-shadow:0 4px 15px rgba(0,0,0,0.02); }
        .ad-thumb { width:64px; height:64px; border-radius:12px; object-fit:cover; border:1px solid rgba(0,0,0,0.05); flex-shrink:0; }
        .ad-meta { flex:1; min-width:0; }
        .ad-title { font-size:14px; font-weight:700; color:#0F172A; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ad-desc { font-size:12px; color:#64748B; margin-bottom:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ad-metrics { display:flex; gap:12px; flex-wrap:wrap; }
        .metric-pill { display:inline-flex; align-items:center; gap:6px; background:rgba(15,23,42,0.03); padding:4px 10px; border-radius:8px; font-size:11px; font-weight:600; color:#0F172A; }
        .metric-pill span { color:#64748B; }

        /* Heatmap */
        .hm-wrapper { overflow-x:auto; padding-bottom:10px; }
        .hm-grid { display:grid; grid-template-columns:40px repeat(24,minmax(20px,1fr)); gap:4px; min-width:600px; }
        .hm-lbl-y { font-size:11px; color:#64748B; font-weight:600; display:flex; align-items:center; justify-content:flex-end; padding-right:8px; }
        .hm-lbl-x { font-size:10px; color:#94A3B8; text-align:center; font-weight:500; }
        .hm-cell { aspect-ratio:1; border-radius:4px; transition:transform 0.1s; cursor:crosshair; }
        .hm-cell:hover { transform:scale(1.2); box-shadow:0 4px 12px rgba(0,0,0,0.1); z-index:2; position:relative; }
        .hm-legend { display:flex; align-items:center; gap:8px; margin-top:20px; justify-content:flex-end; }
        .hm-legend span { font-size:11px; color:#64748B; font-weight:500; }
        
        /* Trend Bars */
        .trend-container { display:flex; align-items:flex-end; gap:8px; height:100px; margin-top:20px; }
        .trend-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; }
        .trend-bar-wrap { width:100%; height:100%; display:flex; align-items:flex-end; background:rgba(15,23,42,0.02); border-radius:6px; overflow:hidden; }
        .trend-bar { width:100%; background:#28A745; border-radius:6px; transition:height 0.8s ease; }
        .trend-lbl { font-size:11px; color:#64748B; font-weight:600; }

        /* Drawer Tables */
        .data-table { width:100%; border-collapse:collapse; }
        .data-table th { text-align:left; padding:12px; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#94A3B8; border-bottom:1px solid rgba(15,23,42,0.05); }
        .data-table td { padding:16px 12px; border-bottom:1px solid rgba(15,23,42,0.05); font-size:13px; color:#0F172A; font-weight:500; }
    `;
    document.head.appendChild(s);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pct = (n, d) => d ? Math.round(n / d * 100) : 0;
const infoIcon = (text) => `<div class="info-btn"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><div class="tooltip">${text}</div></div>`;

function getOpacityColor(val, max) {
    if (!val) return 'rgba(40, 167, 69, 0.05)';
    const t = val / max;
    if (t < 0.25) return 'rgba(40, 167, 69, 0.25)';
    if (t < 0.55) return 'rgba(40, 167, 69, 0.5)';
    if (t < 0.80) return 'rgba(40, 167, 69, 0.8)';
    return 'rgba(40, 167, 69, 1)';
}

// ─── Drawer Logic ─────────────────────────────────────────────────────────────
function openDrawer(title, contentHTML) {
    document.getElementById('drawer-title').innerText = title;
    document.getElementById('drawer-body').innerHTML = contentHTML;
    document.getElementById('an-drawer-overlay').classList.add('open');
    document.getElementById('an-drawer-panel').classList.add('open');
}

window.closeDrawer = function() {
    document.getElementById('an-drawer-overlay').classList.remove('open');
    document.getElementById('an-drawer-panel').classList.remove('open');
};

// ─── Sections ─────────────────────────────────────────────────────────────────

function renderOverview() {
    const f = analyticsData.funnel;
    const top = f[0].count;
    const cvr = pct(f[4].count, f[1].count);
    const rr  = pct(f[2].count, f[1].count);
    const cold = analyticsData.stateBreakdown.find(s=>s.state==='stalled').count;

    const opacities = [1, 0.85, 0.7, 0.55, 0.4];
    const funnelRows = f.map((row, i) => {
        const w = pct(row.count, top);
        return `
        <div class="bar-row">
            <div class="bar-label">${row.stage}</div>
            <div class="bar-outer"><div class="bar-inner" style="width:${w}%; background:rgba(40,167,69,${opacities[i]})"><span class="bar-val" style="color:${i>2?'#0F172A':'#fff'}">${row.count}</span></div></div>
            <div class="bar-pct">${w}%</div>
        </div>`;
    }).join('');

    const maxTrend = Math.max(...analyticsData.weeklyTrend.map(w=>w.new), 1);
    const trendHTML = analyticsData.weeklyTrend.map(w => `
        <div class="trend-col">
            <div class="trend-bar-wrap"><div class="trend-bar" style="height:${pct(w.new, maxTrend)}%; opacity:${w.new===0?0:1}"></div></div>
            <div class="trend-lbl">${w.week}</div>
        </div>
    `).join('');

    return `
        <div class="grid-cards">
            <div class="glass-box interactive" onclick="openDrawer('Pipeline Funnel', generateFunnelDetails())">
                <div class="hero-lbl"><span class="status-dot green"></span> Business Leads</div>
                <div class="hero-num">${f[1].count}</div>
                <div class="hero-sub">From ${f[0].count} total contacts. Click to view pipeline details.</div>
            </div>
            <div class="glass-box">
                <div class="hero-lbl"><span class="status-dot ${rr>=70?'green':'amber'}"></span> Reply Rate</div>
                <div class="hero-num">${rr}%</div>
                <div class="hero-sub">${f[2].count} leads actively engaged.</div>
            </div>
            <div class="glass-box">
                <div class="hero-lbl"><span class="status-dot ${cvr>=20?'green':'amber'}"></span> Conversion</div>
                <div class="hero-num">${cvr}%</div>
                <div class="hero-sub">${f[4].count} successfully closed.</div>
            </div>
        </div>

        <div class="grid-2col">
            <div class="glass-box">
                <div class="section-header">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    Conversion Funnel
                </div>
                ${funnelRows}
            </div>
            <div class="glass-box">
                <div class="section-header">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    Weekly Lead Volume
                </div>
                <div class="trend-container">${trendHTML}</div>
            </div>
        </div>
    `;
}

function renderAds() {
    const ads = analyticsData.adLeaderboard;
    const best = ads[0];

    const adItems = ads.map(ad => `
        <div class="ad-item" onclick="openDrawer('Ad Performance: ${ad.ad_id}', generateAdDetails('${ad.ad_id}'))">
            <img src="${ad.thumbnail}" class="ad-thumb">
            <div class="ad-meta">
                <div class="ad-title">${ad.headline}</div>
                <div class="ad-desc">${ad.body}</div>
                <div class="ad-metrics">
                    <div class="metric-pill"><span>Leads:</span> ${ad.lead_count}</div>
                    <div class="metric-pill"><span>Conv:</span> ${ad.conversion_count}</div>
                    <div class="metric-pill"><span>Score:</span> ${Math.round(ad.quality_score)}/100</div>
                </div>
            </div>
        </div>
    `).join('');

    return `
        <div class="grid-cards">
            <div class="glass-box interactive" onclick="openDrawer('All Ad Campaigns', generateAllAdsTable())">
                <div class="hero-lbl"><span class="status-dot green"></span> Active Ads</div>
                <div class="hero-num">${ads.length}</div>
                <div class="hero-sub">Generating a total of ${ads.reduce((s,a)=>s+a.lead_count,0)} leads. Click to view table.</div>
            </div>
            <div class="glass-box">
                <div class="hero-lbl"><span class="status-dot green"></span> Top Quality Score</div>
                <div class="hero-num">${best.quality_score}</div>
                <div class="hero-sub">Best performing campaign metric.</div>
            </div>
        </div>
        <div class="glass-box">
            <div class="section-header">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                Leaderboard ${infoIcon("Click any ad to see a deep dive of its performance funnel.")}
            </div>
            ${adItems}
        </div>
    `;
}

function renderProducts() {
    const products = analyticsData.productDemand;
    const maxP = Math.max(...products.map(p=>p.count),1);
    
    const bars = products.map((p,i) => `
        <div class="bar-row">
            <div class="bar-label">${p.label}</div>
            <div class="bar-outer"><div class="bar-inner" style="width:${pct(p.count,maxP)}%; background:rgba(40,167,69,${1 - (i*0.15)})"><span class="bar-val">${p.count}</span></div></div>
        </div>
    `).join('');

    return `
        <div class="glass-box">
            <div class="section-header">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                Product Demand Array ${infoIcon("Frequency of products requested by leads.")}
            </div>
            ${bars}
        </div>
    `;
}

function renderTiming() {
    const hm = analyticsData.heatmap;
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const maxV = Math.max(...hm.flat(), 1);

    const xLabels = `<div></div>` + Array.from({length:24},(_,h) => h%4===0 ? `<div class="hm-lbl-x">${h}:00</div>` : `<div></div>`).join('');
    
    const rows = hm.map((row, d) => `
        <div class="hm-lbl-y">${days[d]}</div>
        ${row.map(v => `<div class="hm-cell" style="background:${getOpacityColor(v, maxV)}" title="${v} interactions"></div>`).join('')}
    `).join('');

    return `
        <div class="glass-box">
            <div class="section-header">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Activity Heatmap ${infoIcon("Darker squares indicate higher message volumes.")}
            </div>
            <div class="hm-wrapper">
                <div class="hm-grid">
                    ${xLabels}
                    ${rows}
                </div>
            </div>
            <div class="hm-legend">
                <span>Quiet</span>
                ${['rgba(40,167,69,0.05)','rgba(40,167,69,0.25)','rgba(40,167,69,0.5)','rgba(40,167,69,0.8)','rgba(40,167,69,1)'].map(c=>`<div style="width:16px;height:12px;border-radius:3px;background:${c}"></div>`).join('')}
                <span>Busy</span>
            </div>
        </div>
    `;
}

function renderHealth() {
    const h = analyticsData.convHealth;
    
    return `
        <div class="grid-cards">
            <div class="glass-box interactive" onclick="openDrawer('Health Breakdown', generateHealthDetails())">
                <div class="hero-lbl"><span class="status-dot ${h.avg_reply_time_min<=15?'green':'amber'}"></span> Avg Reply Time</div>
                <div class="hero-num">${h.avg_reply_time_min}m</div>
                <div class="hero-sub">Target is < 15m. Click to view detailed health breakdown.</div>
            </div>
            <div class="glass-box">
                <div class="hero-lbl"><span class="status-dot ${h.open_unread===0?'green':'red'}"></span> Unread Pending</div>
                <div class="hero-num">${h.open_unread}</div>
                <div class="hero-sub">Leads awaiting your response right now.</div>
            </div>
            <div class="glass-box">
                <div class="hero-lbl"><span class="status-dot ${h.pct_ai_managed>=50?'green':'amber'}"></span> AI Handled</div>
                <div class="hero-num">${h.pct_ai_managed}%</div>
                <div class="hero-sub">Conversations fully resolved by AI.</div>
            </div>
            <div class="glass-box">
                <div class="hero-lbl"><span class="status-dot ${h.pct_gone_cold<=15?'green':'amber'}"></span> Stalled Pipeline</div>
                <div class="hero-num">${h.pct_gone_cold}%</div>
                <div class="hero-sub">Leads requiring automated follow-up.</div>
            </div>
        </div>
    `;
}

// ─── Drawer Generators ────────────────────────────────────────────────────────

function generateFunnelDetails() {
    const states = analyticsData.stateBreakdown;
    const total = states.reduce((s,x)=>s+x.count, 0);
    const rows = states.map(s => `
        <tr>
            <td>${s.label}</td>
            <td>${s.count}</td>
            <td>${pct(s.count, total)}%</td>
        </tr>
    `).join('');
    return `
        <div class="section-header">Current Lead States</div>
        <table class="data-table">
            <thead><tr><th>State</th><th>Volume</th><th>Distribution</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function generateAllAdsTable() {
    const rows = analyticsData.adLeaderboard.map(ad => `
        <tr>
            <td><strong>${ad.platform}</strong></td>
            <td>${ad.lead_count}</td>
            <td>${ad.conversion_count}</td>
            <td>${Math.round(ad.quality_score)}</td>
        </tr>
    `).join('');
    return `
        <table class="data-table">
            <thead><tr><th>Platform</th><th>Leads</th><th>Conv.</th><th>Score</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function generateAdDetails(adId) {
    const ad = analyticsData.adLeaderboard.find(a => a.ad_id === adId);
    return `
        <img src="${ad.thumbnail}" style="width:100%; height:200px; object-fit:cover; border-radius:12px; margin-bottom:20px;">
        <h3 style="font-size:16px; font-weight:700; color:#0F172A; margin-bottom:8px;">${ad.headline}</h3>
        <p style="font-size:13px; color:#64748B; margin-bottom:24px;">${ad.body}</p>
        
        <table class="data-table">
            <tbody>
                <tr><td>Platform</td><td>${ad.platform}</td></tr>
                <tr><td>Generated Leads</td><td>${ad.lead_count}</td></tr>
                <tr><td>Replied</td><td>${ad.reply_count} (${pct(ad.reply_count, ad.lead_count)}%)</td></tr>
                <tr><td>Showed Interest</td><td>${ad.product_interest_count} (${pct(ad.product_interest_count, ad.lead_count)}%)</td></tr>
                <tr><td>Converted</td><td>${ad.conversion_count} (${pct(ad.conversion_count, ad.lead_count)}%)</td></tr>
            </tbody>
        </table>
    `;
}

function generateHealthDetails() {
    const h = analyticsData.convHealth;
    return `
        <table class="data-table">
            <tbody>
                <tr><td>Never Replied Rate</td><td><span class="status-dot ${h.pct_never_replied<=20?'green':'red'}"></span> ${h.pct_never_replied}%</td></tr>
                <tr><td>Pipeline Cold Rate</td><td><span class="status-dot ${h.pct_gone_cold<=15?'green':'amber'}"></span> ${h.pct_gone_cold}%</td></tr>
                <tr><td>Opt-Outs</td><td><span class="status-dot ${h.opt_out_count===0?'green':'red'}"></span> ${h.opt_out_count}</td></tr>
            </tbody>
        </table>
        <p style="font-size:12px; color:#64748B; margin-top:24px; padding:12px; background:rgba(15,23,42,0.03); border-radius:8px;">
            Maintaining response times under 15 minutes significantly boosts the likelihood of conversion. Enable AI handling for off-hours to improve your overall metrics.
        </p>
    `;
}

// ─── Navigation & Initialization ──────────────────────────────────────────────

const AN_SECTIONS = [
    { id: 'overview',  label: 'Overview', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>' },
    { id: 'ads',       label: 'Ad Impact', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>' },
    { id: 'products',  label: 'Demand', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>' },
    { id: 'timing',    label: 'Timing', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>' },
    { id: 'health',    label: 'Health', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>' },
];

window.setAnalyticsSection = function(id) {
    activeAnSection = id;
    const navEl  = document.getElementById('an-nav');
    const bodyEl = document.getElementById('an-body');
    if (navEl)  navEl.innerHTML  = buildNav();
    if (bodyEl) bodyEl.innerHTML = buildSection();
};

function buildNav() {
    return AN_SECTIONS.map(s => `
        <button class="an-tab ${activeAnSection===s.id?'active':''}" onclick="setAnalyticsSection('${s.id}')">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">${s.icon}</svg> ${s.label}
        </button>`).join('');
}

function buildSection() {
    switch(activeAnSection) {
        case 'overview': return renderOverview();
        case 'ads':      return renderAds();
        case 'products': return renderProducts();
        case 'timing':   return renderTiming();
        case 'health':   return renderHealth();
        default:         return renderOverview();
    }
}

// ─── Main render ──────────────────────────────────────────────────────────────
async function renderAnalyticsContent() {
    injectAnalyticsStyles();
    const contentArea = document.getElementById('content-area');

    // Pull active context token and fetch real database rows before printing charts
    const businessId = window.getActiveBusinessId();
    if (businessId && window.analyticsService) {
        const liveData = await window.analyticsService.getDashboardMetrics(businessId);
        if (liveData) {
            analyticsData = liveData;
            console.log("[Analytics UI] Live database summaries mounted successfully.");
        }
    }

    contentArea.classList.remove('items-center','justify-center','p-4','overflow-y-auto');
    contentArea.classList.add('overflow-hidden');
    contentArea.style.padding = '0';

    contentArea.innerHTML = `
        <div class="an-wrap">
            <div class="an-topnav" id="an-nav">${buildNav()}</div>
            <div class="an-content" id="an-body">${buildSection()}</div>
            
            <div id="an-drawer-overlay" class="an-drawer-overlay" onclick="closeDrawer()"></div>
            <div id="an-drawer-panel" class="an-drawer-panel">
                <div class="an-drawer-header">
                    <div class="an-drawer-title" id="drawer-title">Details</div>
                    <button class="an-drawer-close" onclick="closeDrawer()"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:20px;height:20px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
                <div class="an-drawer-body" id="drawer-body"></div>
            </div>
        </div>
    `;
}

if (typeof PAGE_CONFIG !== 'undefined') {
    PAGE_CONFIG.analytics = {
        title:       'Analytics',
        description: 'Business intelligence from your conversations.',
        navId:       'nav-analytics',
        render:      renderAnalyticsContent
    };
}
