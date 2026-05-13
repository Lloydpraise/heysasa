// ==========================================
// AI PRODUCT IMPORTER - IMAGE QUEUE & PROCESSING
// ==========================================

// Safety Header: Checks if variables are already declared by other scripts
window.imageQueue = window.imageQueue || []; 
window.processingInProgress = window.processingInProgress || false;
window.currentBusinessId = window.currentBusinessId || 'fortunebooks12';

// Standardize local references so the rest of your code works perfectly
var imageQueue = window.imageQueue;
var processingInProgress = window.processingInProgress;
var currentBusinessId = window.currentBusinessId;
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
    
    // Process only the first file (one at a time rule)
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file (JPG, PNG, WEBP)', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showNotification('Image must be smaller than 5MB', 'error');
        return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64String = e.target.result;
        
        // Add to queue (replace existing if present, keeping only one)
        imageQueue = [{
            id: Date.now(),
            file: file,
            name: file.name,
            base64: base64String,
            size: file.size,
            timestamp: new Date(),
            status: 'pending' // pending, processing, completed, error
        }];
        
        // Update UI
        updateQueueDisplay();
        updateReviewCount();
        
        // Clear the input for next selection
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
    
    if (imageQueue.length === 0) {
        queueList.innerHTML = `<div id="aiEmptyQueueMsg" class="text-center text-[#94A3B8] text-xs py-10 italic">Queue is empty</div>`;
        return;
    }
    
    // Remove empty message if present
    const emptyMsg = document.getElementById('aiEmptyQueueMsg');
    if (emptyMsg) emptyMsg.remove();
    
    // Display queued images
    queueList.innerHTML = imageQueue.map((img, index) => `
        <div class="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-white/60 group hover:bg-white/80 transition-all">
            <!-- Image Thumbnail -->
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
            
            <!-- Image Info -->
            <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-[#0F172A] truncate">${img.name}</p>
                <p class="text-[10px] text-[#94A3B8]">${formatFileSize(img.size)}</p>
            </div>
            
            <!-- Remove Button -->
            <button onclick="removeFromQueue(${img.id})" class="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-lg text-red-500">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function removeFromQueue(imageId) {
    imageQueue = imageQueue.filter(img => img.id !== imageId);
    updateQueueDisplay();
    updateReviewCount();
    updateProcessBtn();
    
    if (imageQueue.length === 0) {
        showNotification('Image removed from queue', 'info');
    }
}

// ==========================================
// IMAGE PROCESSING & AI ANALYSIS
// ==========================================

async function startAiProcessing() {
    const businessId = currentBusinessId;
    
    if (imageQueue.length === 0) {
        showNotification('No images in queue', 'error');
        return;
    }
    
    if (processingInProgress) {
        showNotification('Processing already in progress', 'warning');
        return;
    }
    
    processingInProgress = true;
    updateProcessBtn();
    
    // Process each image in queue
    for (let i = 0; i < imageQueue.length; i++) {
        const imageItem = imageQueue[i];
        
        // Update status to processing
        imageItem.status = 'processing';
        updateQueueDisplay();
        
        try {
            // Call edge function with base64 image
            const result = await sendImageToAI(imageItem.base64, businessId);
            
            if (result.success) {
                imageItem.status = 'completed';
                imageItem.aiData = result.data;
                
                // Move to review container
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
    
    processingInProgress = false;
    updateProcessBtn();
    
    // Clear queue after processing
    setTimeout(() => {
        imageQueue = [];
        updateQueueDisplay();
    }, 2000);
}

async function sendImageToAI(base64Image, businessId) {
    try {
        // Extract base64 data (remove data:image/...;base64, prefix)
        const base64Data = base64Image.split(',')[1];
        
        // Call Supabase edge function
        const response = await fetch(
            `${SUPABASE_URL}/functions/v1/analyze-product-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    image_base64: base64Data,
                    business_id: businessId
                })
            }
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'Unknown error occurred'
            };
        }
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// ==========================================
// REVIEW CONTAINER MANAGEMENT
// ==========================================

function addToReviewContainer(imageItem) {
    const reviewContainer = document.getElementById('aiReviewContainer');
    
    // Remove empty state if exists
    const emptyState = reviewContainer.querySelector('.col-span-full');
    if (emptyState && emptyState.textContent.includes('Processed products')) {
        emptyState.remove();
    }
    
    // Create review card
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card-dashboard p-5 rounded-2xl space-y-4';
    reviewCard.id = `review-${imageItem.id}`;
    reviewCard.innerHTML = `
        <!-- Product Image -->
        <div class="w-full h-48 rounded-xl overflow-hidden bg-gray-100">
            <img src="${imageItem.base64}" alt="Product" class="w-full h-full object-cover">
        </div>
        
        <!-- AI-Generated Data -->
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
        
        <!-- Action Buttons -->
        <div class="flex gap-2 pt-2">
            <button onclick="publishProduct(${imageItem.id})" class="flex-1 py-2.5 bg-[#28A745] text-white rounded-lg text-xs font-bold hover:bg-[#208739] transition-all">
                Publish
            </button>
            <button onclick="removeReviewCard(${imageItem.id})" class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-all">
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

async function publishProduct(imageId) {
    // Get the review card
    const card = document.getElementById(`review-${imageId}`);
    if (!card) return;
    
    // Get values from inputs
    const inputs = card.querySelectorAll('input, textarea');
    const productData = {
        name: inputs[0].value,
        description: inputs[1].value,
        category: inputs[2].value,
        price: parseFloat(inputs[3].value),
        business_id: currentBusinessId
    };
    
    if (!productData.name.trim()) {
        showNotification('Product name is required', 'error');
        return;
    }
    
    // Publish to database (via supabaseAPI)
    try {
        const result = await supabaseAPI.db.insertData('products', productData);
        
        if (!result.success) {
            showNotification(`Error publishing: ${result.error.message}`, 'error');
            return;
        }
        
        showNotification('Product published successfully!', 'success');
        removeReviewCard(imageId);
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// ==========================================
// UI UPDATE HELPERS
// ==========================================

function updateReviewCount() {
    const reviewContainer = document.getElementById('aiReviewContainer');
    const count = reviewContainer.querySelectorAll('.review-card-dashboard').length;
    document.getElementById('aiReviewCount').textContent = count;
}

function updateProcessBtn() {
    const btn = document.getElementById('aiProcessBtn');
    btn.disabled = imageQueue.length === 0 || processingInProgress;
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
    // Create a simple notification (you can enhance this)
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

// Add fade-in animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
`;
document.head.appendChild(style);
