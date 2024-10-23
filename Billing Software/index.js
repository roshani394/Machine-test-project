// Refresh UI: Load customers, products, and billings into tables
function refreshUI() {
    displayCustomers();
    displayProducts();
    displayBillings();
    populateDropdowns();
    updateDashboard(); // New function to update the dashboard
}

// -------------------- Update Dashboard --------------------
function updateDashboard() {
    const billings = JSON.parse(localStorage.getItem('billings')) || [];

    let totalSales = billings.length; // Each billing is one sale
    let totalRevenue = billings.reduce((sum, billing) => sum + billing.amount, 0); // Sum all billing amounts

    document.querySelector('.dashboard .dashboard-card:nth-child(1) p').textContent = `₹ ${totalSales}`;
    document.querySelector('.dashboard .dashboard-card:nth-child(2) p').textContent = `₹ ${totalRevenue.toFixed(2)}`;
}



// -------------------- CUSTOMER MANAGEMENT --------------------
const customerForm = document.getElementById('add-customer');
const customerList = document.getElementById('customer-list');

customerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const customer = {
        name: customerForm.elements[0].value,
        gender: customerForm.elements[1].value,
        contact: customerForm.elements[2].value,
        email: customerForm.elements[3].value,
    };

    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers.push(customer);
    localStorage.setItem('customers', JSON.stringify(customers));
    refreshUI();
    customerForm.reset();
});

function displayCustomers() {
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    customerList.innerHTML = '';

    customers.forEach((customer) => {
        customerList.innerHTML += `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.gender}</td>
                <td>${customer.contact}</td>
                <td>${customer.email}</td>
            </tr>`;
    });
}

// -------------------- PRODUCT MANAGEMENT --------------------
const productForm = document.getElementById('add-product');
const productList = document.getElementById('product-list');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        name: productForm.elements[0].value,
        price: parseFloat(productForm.elements[1].value),
        quantity: parseInt(productForm.elements[2].value),
        brand: productForm.elements[3].value,
        supplier: productForm.elements[4].value,
        oldStock: parseInt(productForm.elements[5].value) || 0,
        category: productForm.elements[6].value,
    };

    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    refreshUI();
    productForm.reset();
});

function displayProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    productList.innerHTML = '';

    products.forEach((product, index) => {
        productList.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>${product.brand}</td>
                <td><button onclick="deleteProduct(${index})">Delete</button></td>
            </tr>`;
    });
}

function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    refreshUI();
}

// -------------------- BILLING MANAGEMENT --------------------
const billingForm = document.getElementById('add-billing');
const billingList = document.getElementById('billing-list');

billingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const customerIndex = billingForm.elements[0].value;
    const productIndex = billingForm.elements[1].value;

    if (customerIndex === '' || productIndex === '') return;

    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const selectedCustomer = customers[customerIndex];
    const selectedProduct = products[productIndex];

    const billing = {
        customer: selectedCustomer.name,
        product: selectedProduct.name,
        amount: selectedProduct.price,
    };

    let billings = JSON.parse(localStorage.getItem('billings')) || [];
    billings.push(billing);
    localStorage.setItem('billings', JSON.stringify(billings));
    refreshUI();
});

function displayBillings() {
    const billings = JSON.parse(localStorage.getItem('billings')) || [];
    billingList.innerHTML = '';

    billings.forEach((billing, index) => {
        billingList.innerHTML += `
            <tr>
                <td>${billing.customer}</td>
                <td>${billing.product}</td>
                <td>₹${billing.amount.toFixed(2)}</td>
                <td><button onclick="deleteBilling(${index})">Delete</button></td>
            </tr>`;
    });
}

function deleteBilling(index) {
    let billings = JSON.parse(localStorage.getItem('billings')) || [];
    billings.splice(index, 1);
    localStorage.setItem('billings', JSON.stringify(billings));
    refreshUI();
}

// -------------------- POPULATE DROPDOWNS --------------------
function populateDropdowns() {
    const customerSelect = billingForm.elements[0];
    const productSelect = billingForm.elements[1];

    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

    customerSelect.innerHTML = '<option value="" disabled selected>Select Customer</option>';
    productSelect.innerHTML = '<option value="" disabled selected>Select Product</option>';

    customers.forEach((customer, index) => {
        customerSelect.innerHTML += `<option value="${index}">${customer.name}</option>`;
    });

    products.forEach((product, index) => {
        productSelect.innerHTML += `<option value="${index}">${product.name}</option>`;
    });
}

// Initialize the UI on page load
document.addEventListener('DOMContentLoaded', refreshUI);
