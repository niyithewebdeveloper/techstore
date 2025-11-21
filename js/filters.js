// Filter functionality for index page
let activeFilters = {
    category: [],
    brand: [],
    price: [],
    search: ''
};

function updateFilters(type, value) {
    if (type === 'price') {
        // For price radio buttons, replace the array with the new value
        activeFilters.price = [value];
        
        // Uncheck other price radio buttons
        document.querySelectorAll('input[name="priceRange"]').forEach(radio => {
            if (radio.value !== value) {
                radio.checked = false;
            }
        });
    } else {
        const index = activeFilters[type].indexOf(value);
        if (index > -1) {
            activeFilters[type].splice(index, 1);
        } else {
            activeFilters[type].push(value);
        }
    }
    updateActiveFiltersDisplay();
    filterProducts();
}

function applyPriceFilter() {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    
    if (minPrice || maxPrice) {
        activeFilters.price = [`$${minPrice || '0'}-$${maxPrice || '9999'}`];
        updateActiveFiltersDisplay();
        filterProducts();
    }
}

function performSearch() {
    const searchTerm = document.getElementById('mainSearch').value.toLowerCase();
    activeFilters.search = searchTerm;
    updateActiveFiltersDisplay();
    filterProducts();
}

function updateActiveFiltersDisplay() {
    const activeFiltersContainer = document.getElementById('activeFilters');
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';

    // Add search filter if exists
    if (activeFilters.search) {
        const searchFilter = document.createElement('div');
        searchFilter.className = 'active-filter';
        searchFilter.innerHTML = `
            Search: "${activeFilters.search}"
            <button class="remove-filter" onclick="removeFilter('search', '${activeFilters.search}')">×</button>
        `;
        activeFiltersContainer.appendChild(searchFilter);
    }

    // Add category filters
    activeFilters.category.forEach(category => {
        const filter = document.createElement('div');
        filter.className = 'active-filter';
        filter.innerHTML = `
            Category: ${category}
            <button class="remove-filter" onclick="removeFilter('category', '${category}')">×</button>
        `;
        activeFiltersContainer.appendChild(filter);
    });

    // Add brand filters
    activeFilters.brand.forEach(brand => {
        const filter = document.createElement('div');
        filter.className = 'active-filter';
        filter.innerHTML = `
            Brand: ${brand}
            <button class="remove-filter" onclick="removeFilter('brand', '${brand}')">×</button>
        `;
        activeFiltersContainer.appendChild(filter);
    });

    // Add price filters
    activeFilters.price.forEach(price => {
        const filter = document.createElement('div');
        filter.className = 'active-filter';
        filter.innerHTML = `
            Price: ${price}
            <button class="remove-filter" onclick="removeFilter('price', '${price}')">×</button>
        `;
        activeFiltersContainer.appendChild(filter);
    });

    // Add clear all button if there are active filters
    if (Object.values(activeFilters).some(filter => filter.length > 0) || activeFilters.search) {
        const clearButton = document.createElement('button');
        clearButton.className = 'clear-filters';
        clearButton.textContent = 'Clear All';
        clearButton.onclick = clearAllFilters;
        activeFiltersContainer.appendChild(clearButton);
    }
}

function removeFilter(type, value) {
    if (type === 'search') {
        activeFilters.search = '';
        const mainSearch = document.getElementById('mainSearch');
        if (mainSearch) {
            mainSearch.value = '';
        }
    } else {
        const index = activeFilters[type].indexOf(value);
        if (index > -1) {
            activeFilters[type].splice(index, 1);
            
            // Uncheck corresponding checkbox
            const checkboxId = `${type}-${value.toLowerCase().replace(/\s+/g, '-')}`;
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    }
    updateActiveFiltersDisplay();
    filterProducts();
}

function clearAllFilters() {
    activeFilters = {
        category: [],
        brand: [],
        price: [],
        search: ''
    };
    
    // Clear search input
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) {
        mainSearch.value = '';
    }
    
    // Clear price inputs
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    
    // Uncheck all checkboxes and radio buttons
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    updateActiveFiltersDisplay();
    filterProducts();
}

function filterProducts() {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    products.forEach(product => {
        const category = product.getAttribute('data-category');
        const brand = product.getAttribute('data-brand');
        const price = parseInt(product.getAttribute('data-price'));
        const title = product.querySelector('h3').textContent.toLowerCase();
        const description = product.querySelector('p').textContent.toLowerCase();

        let matchesSearch = true;
        let matchesCategory = true;
        let matchesBrand = true;
        let matchesPrice = true;

        // Search filter
        if (activeFilters.search) {
            matchesSearch = title.includes(activeFilters.search) || 
                           description.includes(activeFilters.search) ||
                           category.toLowerCase().includes(activeFilters.search) ||
                           brand.toLowerCase().includes(activeFilters.search);
        }

        // Category filter
        if (activeFilters.category.length > 0) {
            matchesCategory = activeFilters.category.includes(category);
        }

        // Brand filter
        if (activeFilters.brand.length > 0) {
            matchesBrand = activeFilters.brand.includes(brand);
        }

        // Price filter
        if (activeFilters.price.length > 0) {
            const priceFilter = activeFilters.price[0];
            if (priceFilter === 'Under $100') {
                matchesPrice = price < 100;
            } else if (priceFilter === '$100 - $500') {
                matchesPrice = price >= 100 && price <= 500;
            } else if (priceFilter === '$500 - $1000') {
                matchesPrice = price >= 500 && price <= 1000;
            } else if (priceFilter === 'Over $1000') {
                matchesPrice = price > 1000;
            } else if (priceFilter.includes('-$')) {
                // Custom price range
                const [min, max] = priceFilter.replace('$', '').split('-').map(Number);
                matchesPrice = price >= min && price <= max;
            }
        }

        if (matchesSearch && matchesCategory && matchesBrand && matchesPrice) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });

    // Show message if no products match
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    let noResultsMsg = productsGrid.querySelector('.no-results');
    
    if (visibleCount === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.style.gridColumn = '1 / -1';
            noResultsMsg.style.textAlign = 'center';
            noResultsMsg.style.padding = '2rem';
            noResultsMsg.style.color = '#666';
            noResultsMsg.innerHTML = `
                <h3 style="margin-bottom: 1rem; color: #333;">No products found matching your criteria</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onclick="clearAllFilters()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #10c48a; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Clear All Filters
                </button>
            `;
            productsGrid.appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Allow Enter key to trigger search
document.addEventListener('DOMContentLoaded', function() {
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) {
        mainSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Initialize filters when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('activeFilters')) {
        filterProducts();
    }
});