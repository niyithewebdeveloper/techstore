// Common functionality for all pages
let cart = [];
let cartCount = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    // Initialize product-specific functionality if on product page
    if (document.getElementById('mainProductImage')) {
        initializeProductPage();
    }
    
    // Initialize filters if on home page
    if (document.getElementById('activeFilters')) {
        initializeFilters();
    }
});

// Product page initialization
function initializeProductPage() {
    // Set default selected variants if not already set
    if (typeof selectedVariants === 'undefined') {
        window.selectedVariants = {};
        
        // Initialize from default selected options
        const selectedOptions = document.querySelectorAll('.variant-option.selected');
        selectedOptions.forEach(option => {
            const variantGroup = option.closest('.variant-group');
            if (variantGroup) {
                const variantTitle = variantGroup.querySelector('.variant-title').textContent.toLowerCase();
                window.selectedVariants[variantTitle] = option.textContent;
            }
        });
    }
}

// Filters initialization
function initializeFilters() {
    // Add event listeners for filter dropdowns
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');
    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        const dropdowns = document.querySelectorAll('.filter-dropdown-content');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    });
}

// Product image gallery functionality
function changeImage(src) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = src;
        
        // Update active thumbnail
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        event.target.classList.add('active');
    }
}

// Variant selection functionality
function selectVariant(element, type, value) {
    // Update selected variant
    if (typeof selectedVariants !== 'undefined') {
        selectedVariants[type] = value;
    }
    
    // Update UI
    const parent = element.parentElement;
    const options = parent.querySelectorAll('.variant-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

// Quantity selector functionality
function changeQuantity(change) {
    let quantityElement = document.getElementById('quantity');
    if (quantityElement) {
        let quantity = parseInt(quantityElement.textContent) + change;
        if (quantity < 1) quantity = 1;
        quantityElement.textContent = quantity;
    }
}

// View product details
function viewProductDetails(productPage) {
    window.location.href = productPage;
}

// Notification system
function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10c48a;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartModal = document.getElementById('cartModal');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartModal && cartIcon) {
        if (!cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
            cartModal.style.display = 'none';
        }
    }
});

// Mobile menu toggle (for future enhancement)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// Utility function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}