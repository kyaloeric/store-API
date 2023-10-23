
const productsContainer = document.querySelector('.products');
const categorySelect = document.getElementById('category');
const cartItems = document.getElementById('cart-items');
const grandTotal = document.getElementById('grand-total');
const clearCartButton = document.getElementById('clear-cart');


// const productModal = document.getElementById('product-modal');
// const modalImage = document.getElementById('modal-image');
// const modalTitle = document.getElementById('modal-title');
// const modalDescription = document.getElementById('modal-description');
// const modalPrice = document.getElementById('modal-price');
// const modalAddToCart = document.getElementById('modal-add-to-cart');
// const closeProductModal = document.getElementById('close-modal');

let products = [];
let cart = [];


// Fetch products and categories
fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        products = data;
        displayProducts(data);
        populateCategories(data);
    });

function displayProducts(products) {
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productsContainer.appendChild(productCard);
    });


    
}

function populateCategories(products) {
    // Fetch categories from the API
    fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(categories => {
            categorySelect.innerHTML = '<option value="">All Categories</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        });

    // Event listener for category selection
    categorySelect.addEventListener('change', () => {
        const selectedCategory = categorySelect.value;
        if (selectedCategory) {
            // Fetch products in the selected category
            fetch(`https://fakestoreapi.com/products/category/${selectedCategory}`)
                .then(res => res.json())
                .then(filteredProducts => displayProducts(filteredProducts));
        } else {
            // Display all products
            displayProducts(products);
        }
    });
}


// Add to cart button click event
productsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        if (product) {
            addToCart(product);
        }
    }
});

function addToCart(product) {
    cart.push(product);
    // Update the cart UI
    displayCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    // Update the cart UI
    displayCart();
}

// Display cart
function displayCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(product => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            ${product.title} - $${product.price}
            <button class="remove-from-cart" data-id="${product.id}">Remove from Cart</button>
        `;
        cartItems.appendChild(cartItem);
        total += product.price;
    });
    grandTotal.textContent = total.toFixed(2);
    document.getElementById('cart-count').textContent = cart.length;
}

// Remove from cart button click event
cartItems.addEventListener('click', e => {
    if (e.target.classList.contains('remove-from-cart')) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        removeFromCart(productId);
    }
});

// Clear cart
clearCartButton.addEventListener('click', () => {
    cart = [];
    displayCart();
})
