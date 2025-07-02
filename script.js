// Silk Road Marketplace - Anonymous Trading Platform
// Data Storage (in-memory)
let products = [];
let currentProducts = [...products];

// Anonymous ID Generator
function generateAnonymousId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId + '-page').classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.btn-nav').forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.color = '#e0e0e0';
    });
    
    event.target.style.background = '#bb86fc';
    event.target.style.color = '#000';
    
    // Load content for specific pages
    if (pageId === 'browse') {
        displayProducts();
    }
}

// Product Display Functions
function displayProducts() {
    const grid = document.getElementById('products-grid');
    
    if (currentProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = currentProducts.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <img src="${product.image}" alt="${product.title}" class="product-image" 
                 onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"300\" viewBox=\"0 0 400 300\"><rect width=\"400\" height=\"300\" fill=\"%23333\"/><text x=\"200\" y=\"150\" text-anchor=\"middle\" fill=\"%23999\" font-family=\"Arial\" font-size=\"16\">No Image</text></svg>'">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">£${product.price.toFixed(2)}</div>
                <div class="product-meta">
                    <span>📍 ${product.location}</span>
                    <span>🕒 ${formatTimestamp(product.timestamp)}</span>
                </div>
                <p class="product-description">${product.description}</p>
                <span class="seller-badge">🔒 Anonymous Seller #${product.sellerId}</span>
            </div>
        </div>
    `).join('');
}

// Product Modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="modal-product-image"
             onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"300\" viewBox=\"0 0 600 300\"><rect width=\"600\" height=\"300\" fill=\"%23333\"/><text x=\"300\" y=\"150\" text-anchor=\"middle\" fill=\"%23999\" font-family=\"Arial\" font-size=\"20\">No Image Available</text></svg>'">
        <h2 class="modal-product-title">${product.title}</h2>
        <div class="modal-product-price">£${product.price.toFixed(2)}</div>
        <div class="modal-product-meta">
            <span>📍 ${product.location}</span>
            <span>🕒 ${formatTimestamp(product.timestamp)}</span>
            <span>🔒 Anonymous Seller #${product.sellerId}</span>
        </div>
        <p class="modal-product-description">${product.description}</p>
        <div style="margin-top: 2rem; padding: 1rem; background: rgba(187, 134, 252, 0.1); border-radius: 8px; text-align: center;">
            <p style="color: #bb86fc; margin-bottom: 0.5rem;">🔒 Anonymous Transaction</p>
            <p style="color: #aaa; font-size: 0.9rem;">Contact seller through secure channels to complete purchase</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeModal(event) {
    const modal = document.getElementById('product-modal');
    if (event && event.target !== modal && event.target !== document.querySelector('.close')) {
        return;
    }
    modal.style.display = 'none';
}

// Filter and Search Functions
function filterProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const locationFilter = document.getElementById('location-filter').value.toLowerCase();
    
    currentProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesLocation = !locationFilter || product.location.toLowerCase().includes(locationFilter);
        
        return matchesSearch && matchesLocation;
    });
    
    displayProducts();
}

function sortProducts() {
    const sortBy = document.getElementById('sort').value;
    
    switch (sortBy) {
        case 'newest':
            currentProducts.sort((a, b) => b.timestamp - a.timestamp);
            break;
        case 'price-low':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
    }
    
    displayProducts();
}

// Sell Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const sellForm = document.getElementById('sell-form');
    
    sellForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('product-title').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            location: document.getElementById('product-location').value
        };
        
        // Get selected image (from library or URL)
        const selectedImage = getSelectedImage();
        
        // Validate required fields
        if (!formData.title || !formData.description || !formData.price || !formData.location) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create new product
        const newProduct = {
            id: products.length + 1,
            title: formData.title,
            description: formData.description,
            price: formData.price,
            location: formData.location,
            image: selectedImage || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
            timestamp: Date.now(),
            sellerId: generateAnonymousId()
        };
        
        // Add to products array
        products.unshift(newProduct);
        currentProducts = [...products];
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <strong>✅ Product Listed Successfully!</strong><br>
            Your product has been added to the marketplace anonymously.<br>
            Seller ID: #${newProduct.sellerId}
        `;
        
        sellForm.insertBefore(successMessage, sellForm.firstChild);
        
        // Clear form
        clearSellForm();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
        
        // Auto-switch to browse page after 3 seconds
        setTimeout(() => {
            showPage('browse');
        }, 3000);
    });
    
    // Initialize page
    displayProducts();
});

// Utility Functions
function formatTimestamp(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    if (diff < minute) {
        return 'Just now';
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes}m ago`;
    } else if (diff < day) {
        const hours = Math.floor(diff / hour);
        return `${hours}h ago`;
    } else {
        const days = Math.floor(diff / day);
        return `${days}d ago`;
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Image Selection Functions
let selectedImageSrc = null;
let selectedImageSource = 'none'; // 'library', 'url', 'none'

// Library Functions
function toggleImageLibrary() {
    const library = document.getElementById('image-library');
    const urlContainer = document.getElementById('url-input-container');
    
    if (library.style.display === 'none' || library.style.display === '') {
        library.style.display = 'block';
        urlContainer.style.display = 'none';
    } else {
        library.style.display = 'none';
    }
}

function selectImage(imageSrc) {
    // Remove previous selections
    document.querySelectorAll('.library-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Mark new selection
    event.target.closest('.library-item').classList.add('selected');
    
    selectedImageSrc = imageSrc;
    selectedImageSource = 'library';
    
    // Show preview
    showImagePreview(imageSrc, 'Selected from library');
    
    // Hide library and clear other inputs
    document.getElementById('image-library').style.display = 'none';
    document.getElementById('product-image-url').value = '';
}

// URL Functions
function toggleUrlInput() {
    const urlContainer = document.getElementById('url-input-container');
    const library = document.getElementById('image-library');
    
    if (urlContainer.style.display === 'none' || urlContainer.style.display === '') {
        urlContainer.style.display = 'flex';
        library.style.display = 'none';
        document.getElementById('product-image-url').focus();
    } else {
        urlContainer.style.display = 'none';
    }
}

function applyImageUrl() {
    const urlInput = document.getElementById('product-image-url');
    const imageUrl = urlInput.value.trim();
    
    if (imageUrl) {
        // Validate URL format
        try {
            new URL(imageUrl);
            selectedImageSrc = imageUrl;
            selectedImageSource = 'url';
            showImagePreview(imageUrl, 'Custom URL');
            document.getElementById('url-input-container').style.display = 'none';
        } catch (e) {
            alert('Please enter a valid URL');
            urlInput.focus();
        }
    } else {
        alert('Please enter an image URL');
        urlInput.focus();
    }
}

// Preview Functions
function showImagePreview(imageSrc, source) {
    const preview = document.getElementById('selected-image-preview');
    const previewImg = document.getElementById('preview-image');
    const imageInfo = document.getElementById('image-source');
    
    previewImg.src = imageSrc;
    imageInfo.textContent = source;
    preview.style.display = 'block';
    
    // Add image load error handling
    previewImg.onerror = function() {
        alert('Failed to load image. Please try a different image.');
        removeSelectedImage();
    };
}

function hideOtherOptions() {
    document.getElementById('image-library').style.display = 'none';
    document.getElementById('url-input-container').style.display = 'none';
    document.getElementById('product-image-url').value = '';
}

function changeImage() {
    // Reset current selection and show options again
    selectedImageSrc = null;
    selectedImageSource = 'none';
    document.getElementById('selected-image-preview').style.display = 'none';
    
    // Clear all inputs and selections
    document.getElementById('product-image-url').value = '';
    document.querySelectorAll('.library-item').forEach(item => {
        item.classList.remove('selected');
    });
}

function removeSelectedImage() {
    selectedImageSrc = null;
    selectedImageSource = 'none';
    document.getElementById('selected-image-preview').style.display = 'none';
    document.getElementById('product-image-url').value = '';
    
    // Clear all selections
    document.querySelectorAll('.library-item').forEach(item => {
        item.classList.remove('selected');
    });
}

function getSelectedImage() {
    // Return selected image or default
    return selectedImageSrc || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
}

// Clear form function
function clearSellForm() {
    document.getElementById('sell-form').reset();
    removeSelectedImage();
    
    // Hide all image selection panels
    document.getElementById('image-library').style.display = 'none';
    document.getElementById('url-input-container').style.display = 'none';
}

// Add pulse animation for better UX
const pulseKeyframes = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
}
`;

// Add the animation to the page
if (!document.querySelector('#pulse-animation-style')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation-style';
    style.textContent = pulseKeyframes;
    document.head.appendChild(style);
}
