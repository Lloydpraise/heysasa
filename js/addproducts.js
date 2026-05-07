// 1. Grab the elements from your HTML
const importerModal = document.getElementById('aiImporterModal');
const openBtn = document.getElementById('openModalBtn');
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const saveAllBtn = document.getElementById('saveAllBtn');
const fileInput = document.getElementById('fileInput');
const productRows = document.getElementById('productRows');
const confirmOverlay = document.getElementById('saveConfirmOverlay');

// 2. Open Modal Logic
if (openBtn) {
    openBtn.onclick = function() {
        importerModal.classList.remove('hidden');
        resetModal();
        console.log("Modal opened successfully!");
    };
} else {
    console.error("The button with ID 'openModalBtn' was not found!");
}

// 3. The Close Logic (Cleaned up duplicate)
function closeImporterModal() {
    importerModal.classList.add('hidden');
}

function resetModal() {
    screen1.classList.remove('hidden');
    screen2.classList.add('hidden');
    saveAllBtn.classList.add('hidden');
    productRows.innerHTML = '';
}

// ... (Your existing element selectors remain the same)

// 4. Handle Multiple Image Uploads Sequentially
fileInput.addEventListener('change', async function(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    screen1.classList.add('hidden');
    screen2.classList.remove('hidden');
    productRows.innerHTML = ''; 

    for (const file of files) {
        // --- NEW: Create a temporary URL for the image ---
        const tempImageUrl = URL.createObjectURL(file);

        const loadingRow = document.createElement('tr');
        loadingRow.innerHTML = `
            <td colspan="4" class="p-6 text-center text-slate-500 animate-pulse italic">
                Scanning ${file.name}...
            </td>`;
        productRows.appendChild(loadingRow);

        try {
            const productData = await fakeAIImageReader(file);

            // --- NEW: Attach the image URL to the data object ---
            productData.img = tempImageUrl;

            loadingRow.remove();
            renderNewProduct(productData);
            
            saveAllBtn.classList.remove('hidden');

        } catch (err) {
            loadingRow.innerHTML = `<td colspan="4" class="p-4 text-red-500">Error reading ${file.name}</td>`;
        }
    }
});

// Helper Function: Injects the HTML into your table (Updated for Images)
function renderNewProduct(p) {
    const html = `
        <tr class="glass-card bg-white/40 border-none product-entry-row">
            <!-- NEW: Image Preview Column -->
            <td class="p-4 rounded-l-2xl">
                <div class="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shadow-sm">
                    <img src="${p.img}" class="w-full h-full object-cover preview-img">
                </div>
            </td>
            <td class="p-4">
                <input type="text" value="${p.name}" class="product-name bg-transparent border-none focus:ring-0 w-full font-semibold text-sm">
            </td>
            <td class="p-4">
                <input type="text" value="${p.short_desc}" class="product-desc bg-transparent border-none focus:ring-0 w-full text-xs text-[#64748B]">
            </td>
            <td class="p-4 rounded-r-2xl text-right">
                <div class="flex items-center justify-end gap-1">
                    <span class="text-xs font-bold text-[#28A745]">$</span>
                    <input type="number" value="${p.price}" class="product-price bg-transparent border-none focus:ring-0 w-20 font-bold text-[#28A745] text-right">
                </div>
            </td>
        </tr>
    `;
    productRows.insertAdjacentHTML('beforeend', html);
}

// 5. Save & Confirmation Logic (Updated to grab data from the table)
document.getElementById('finalConfirmBtn').onclick = () => {
    // Collect all rows from the table
    const rows = document.querySelectorAll('.product-entry-row');
    
    rows.forEach(row => {
        const newProduct = {
            id: Date.now() + Math.random(),
            title: row.querySelector('.product-name').value,
            description: row.querySelector('.product-desc').value,
            price: row.querySelector('.product-price').value,
            img: row.querySelector('.preview-img').src, // Grabs the blob URL
            status: 'added'
        };

        // Push to your main mockProducts array (from your other file)
        if (typeof mockProducts !== 'undefined') {
            mockProducts.unshift(newProduct);
        }
    });

    console.log("Saving products to system...");
    confirmOverlay.classList.add('hidden');
    closeImporterModal();
    
    // Refresh the main page display
    if (typeof renderProductsPage === 'function') {
        renderProductsPage();
    }
    
    alert("Products added successfully!");
};