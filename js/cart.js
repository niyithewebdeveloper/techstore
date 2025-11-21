// Cart functionality
function addToCart(name, price) {
    let selectedVariants = {};
    let quantity = 1;
    
    // Get selected variants if they exist
    if (typeof window.selectedVariants !== 'undefined') {
        selectedVariants = window.selectedVariants;
        const quantityElement = document.getElementById('quantity');
        if (quantityElement) {
            quantity = parseInt(quantityElement.textContent);
        }
    }
    
    // Create a unique ID based on product and selected variants
    const variantString = Object.values(selectedVariants).join('-');
    const cartItemId = `${name}-${variantString}`;
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === cartItemId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            id: cartItemId,
            name: name, 
            price: price, 
            quantity: quantity,
            variants: {...selectedVariants}
        });
    }
    cartCount += quantity;
    updateCartUI();
    
    // Create notification message
    let notificationMessage = `${name}`;
    if (Object.values(selectedVariants).length > 0) {
        notificationMessage += ` (${Object.values(selectedVariants).join(', ')})`;
    }
    notificationMessage += ' added to cart!';
    
    showNotification(notificationMessage);
    
    // Reset quantity if on product page
    const quantityElement = document.getElementById('quantity');
    if (quantityElement) {
        quantityElement.textContent = '1';
    }
}

function updateCartUI() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems && cartTotal) {
        cartItems.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                cartItems.innerHTML += `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <div><strong>${item.name}</strong></div>
                            <div>${Object.values(item.variants).join(', ')}</div>
                            <div>$${item.price} x ${item.quantity} = $${itemTotal}</div>
                        </div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
                            <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
                        </div>
                    </div>
                `;
            });
        }
        
        cartTotal.innerHTML = `<h3>Total: $${total}</h3>`;
    }
}

function updateCartQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            cartCount += change;
            updateCartUI();
        }
    }
}

function removeFromCart(index) {
    if (cart[index]) {
        cartCount -= cart[index].quantity;
        cart.splice(index, 1);
        updateCartUI();
        showNotification('Item removed from cart');
    }
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    alert(`Thank you for your purchase! Total: $${total}\n\nThis is a demo site created by Niyi the Web Developer.`);
    
    // Clear cart
    cart = [];
    cartCount = 0;
    updateCartUI();
    toggleCart();
}

// Export cart data for other modules (if needed)
function getCartData() {
    return {
        items: cart,
        count: cartCount,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
}