// ==========================================
// AI PRODUCT IMPORTER - IMAGE QUEUE & PROCESSING
// ==========================================

window.imageQueue = window.imageQueue || []; 
window.processingInProgress = window.processingInProgress || false;
window.currentBusinessId = window.currentBusinessId || 'fortunebooks12';

// Initialize importer on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeImporter();
});

function initializeImporter() {
    const fileInput = document.getElementById('aiFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
}

// ==========================================
// FILE SELECTION & BASE64 CONVERSION
// ==========================================

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    const file = files[0];
    
    if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file (JPG, PNG, WEBP)', 'error');
        return;
    }
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showNotification('Image must be smaller than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64String = e.target.result;
        
        window.imageQueue = [{
            id: Date.now(),
            file: file,
            name: file.name,
            base64: base64String,
            size: file.size,
            timestamp: new Date(),
            status: 'pending'
        }];
        
        updateQueueDisplay();
        updateReviewCount();
        
        event.target.value = '';
        showNotification(`Image queued: ${file.name}`, 'success');
    };
    
    reader.onerror = () => {
        showNotification('Error reading file', 'error');
    };
    
    reader.readAsDataURL(file);
}

// ==========================================
// QUEUE MANAGEMENT & DISPLAY
// ==========================================

function updateQueueDisplay() {
    const queueList = document.getElementById('aiQueueList');
    if (!queueList) return;
    
    if (window.imageQueue.length === 0) {
        queueList.innerHTML = `<div id="aiEmptyQueueMsg" class="text-center text-[#94A3B8] text-xs py-10 italic">Queue is empty</div>`;
        return;
    }
    
    const emptyMsg = document.getElementById('aiEmptyQueueMsg');
    if (emptyMsg) emptyMsg.remove();
    
    queueList.innerHTML = window.imageQueue.map((img, index) => `
        <div class="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-white/60 group hover:bg-white/80 transition-all">
            <div class="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                <img src="${img.base64}" alt="${img.name}" class="w-full h-full object-cover">
                ${img.status === 'processing' ? `
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div class="loader-spinner"></div>
                    </div>
                ` : ''}
                ${img.status === 'completed' ? `
                    <div class="absolute inset-0 bg-[#28A745]/80 flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                ` : ''}
                ${img.status === 'error' ? `
                    <div class="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                ` : ''}
            </div>
            
            <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-[#0F172A] truncate">${img.name}</p>
                <p class="text-[10px] text-[#94A3B8]">${formatFileSize(img.size)}</p>
            </div>
            
            <button onclick="window.removeFromQueue(${img.id})" class="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-lg text-red-500">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function removeFromQueue(imageId) {
    window.imageQueue = window.imageQueue.filter(img => img.id !== imageId);
    updateQueueDisplay();
    updateReviewCount();
    updateProcessBtn();
    
    if (window.imageQueue.length === 0) {
        showNotification('Image removed from queue', 'info');
    }
}

// ==========================================
// IMAGE PROCESSING & AI ANALYSIS
// ==========================================

async function startAiProcessing() {
    const businessId = localStorage.getItem('current_business_id') || window.currentBusinessId;
    
    if (window.imageQueue.length === 0) {
        showNotification('No images in queue', 'error');
        return;
    }
    
    if (window.processingInProgress) {
        showNotification('Processing already in progress', 'warning');
        return;
    }
    
    window.processingInProgress = true;
    updateProcessBtn();
    
    for (let i = 0; i < window.imageQueue.length; i++) {
        const imageItem = window.imageQueue[i];
        imageItem.status = 'processing';
        updateQueueDisplay();
        
        try {
            const result = await sendImageToAI(imageItem.base64, businessId);
            
            if (result.success) {
                imageItem.status = 'completed';
                imageItem.aiData = result.data;
                addToReviewContainer(imageItem);
                showNotification(`Image analyzed successfully`, 'success');
            } else {
                imageItem.status = 'error';
                imageItem.error = result.error;
                showNotification(`Error analyzing image: ${result.error}`, 'error');
            }
        } catch (error) {
            imageItem.status = 'error';
            imageItem.error = error.message;
            showNotification(`Error: ${error.message}`, 'error');
        }
        
        updateQueueDisplay();
    }
    
    window.processingInProgress = false;
    updateProcessBtn();
    
    setTimeout(() => {
        window.imageQueue = [];
        updateQueueDisplay();
    }, 2000);
}

async function sendImageToAI(base64Image, businessId) {
    try {
        const base64Data = base64Image.split(',')[1];
        
        // Use global variables or configuration for edge endpoints
        const url = (typeof SUPABASE_URL !== 'undefined') ? SUPABASE_URL : '';
        const key = (typeof SUPABASE_ANON_KEY !== 'undefined') ? SUPABASE_ANON_KEY : '';

        const response = await fetch(
            `${url}/functions/v1/analyze-product-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    image_base64: base64Data,
                    business_id: businessId
                })
            }
        );
        
        const data = await response.json();
        if (!response.ok) {
            return { success: false, error: data.error || 'Unknown error occurred' };
        }
        return { success: true, data: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==========================================
// REVIEW CONTAINER MANAGEMENT
// ==========================================

function addToReviewContainer(imageItem) {
    const reviewContainer = document.getElementById('aiReviewContainer');
    if (!reviewContainer) return;
    
    const emptyState = reviewContainer.querySelector('.col-span-full');
    if (emptyState && emptyState.textContent.includes('Processed products')) {
        emptyState.remove();
    }
    
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card-dashboard p-5 rounded-2xl space-y-4 bg-white border border-gray-100 shadow-sm';
    reviewCard.id = `review-${imageItem.id}`;
    reviewCard.innerHTML = `
        <div class="w-full h-48 rounded-xl overflow-hidden bg-gray-100">
            <img src="${imageItem.base64}" alt="Product" class="w-full h-full object-cover">
        </div>
        
        <div class="space-y-3">
            <div>
                <label class="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Product Name</label>
                <input type="text" value="${imageItem.aiData?.product_name || 'Untitled Product'}" 
                       class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 ring-[#28A745]/20"
                       placeholder="Enter product name">
            </div>
            
            <div>
                <label class="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Description</label>
                <textarea class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 ring-[#28A745]/20 resize-none h-20"
                          placeholder="Enter product description">${imageItem.aiData?.description || ''}</textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Category</label>
                    <input type="text" value="${imageItem.aiData?.category || ''}" 
                           class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 ring-[#28A745]/20"
                           placeholder="Category">
                </div>
                <div>
                    <label class="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Price (KSh)</label>
                    <input type="number" value="${imageItem.aiData?.suggested_price || ''}" 
                           class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 ring-[#28A745]/20"
                           placeholder="0.00">
                </div>
            </div>
            
            <div>
                <label class="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">AI Analysis</label>
                <div class="bg-[#28A745]/5 border border-[#28A745]/20 rounded-lg p-3 text-xs text-[#0F172A] leading-relaxed">
                    ${imageItem.aiData?.analysis || 'No analysis available'}
                </div>
            </div>
        </div>
        
        <div class="flex gap-2 pt-2">
            <button onclick="window.publishProduct(${imageItem.id})" class="flex-1 py-2.5 bg-[#28A745] text-white rounded-lg text-xs font-bold hover:bg-[#208739] transition-all">
                Publish
            </button>
            <button onclick="window.removeReviewCard(${imageItem.id})" class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-all">
                Discard
            </button>
        </div>
    `;
    
    reviewContainer.appendChild(reviewCard);
    updateReviewCount();
}

function removeReviewCard(imageId) {
    const card = document.getElementById(`review-${imageId}`);
    if (card) {
        card.remove();
        updateReviewCount();
    }
}

// Live Database Publishing
async function publishProduct(imageId) {
    const card = document.getElementById(`review-${imageId}`);
    if (!card) return;
    
    const inputs = card.querySelectorAll('input, textarea');
    const imgEl = card.querySelector('img');
    
    const productPayload = {
        id: crypto.randomUUID(),
        business_id: localStorage.getItem('current_business_id') || window.currentBusinessId,
        title: inputs[0].value,
        description: inputs[1].value,
        product_type: inputs[2].value, // Category maps to product_type text field
        price: parseFloat(inputs[3].value) || 0,
        img: imgEl ? imgEl.src : '',
        status: 'manual'
    };
    
    if (!productPayload.title.trim()) {
        showNotification('Product name is required', 'error');
        return;
    }
    
    try {
        const result = await productService.addProduct(productPayload);
        
        if (!result.success) {
            showNotification(`Error publishing: ${result.error}`, 'error');
            return;
        }
        
        showNotification('Product published successfully!', 'success');
        removeReviewCard(imageId);
        
        // Signal products list view to reload next time it renders
        if (typeof window.isInitialized !== 'undefined') {
            window.isInitialized = false;
        }
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// ==========================================
// UI UPDATE HELPERS
// ==========================================

function updateReviewCount() {
    const reviewContainer = document.getElementById('aiReviewContainer');
    if (!reviewContainer) return;
    const count = reviewContainer.querySelectorAll('.review-card-dashboard').length;
    const countEl = document.getElementById('aiReviewCount');
    if (countEl) countEl.textContent = count;
}

function updateProcessBtn() {
    const btn = document.getElementById('aiProcessBtn');
    if (btn) {
        btn.disabled = window.imageQueue.length === 0 || window.processingInProgress;
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl text-sm font-bold shadow-lg text-white z-[200] transition-all animate-fade-in-up ${
        type === 'success' ? 'bg-[#28A745]' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Globals injection for inline HTML layout listeners
window.removeFromQueue = removeFromQueue;
window.startAiProcessing = startAiProcessing;
window.removeReviewCard = removeReviewCard;
window.publishProduct = publishProduct;

const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
`;
document.head.appendChild(style);