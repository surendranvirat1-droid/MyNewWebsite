const defaultProducts = [
  { id: 'p1', name: 'Amla Powder', category: 'Herbal', price: 180, image: 'https://images.unsplash.com/photo-1624138383063-ea8d8f95b7e9?auto=format&fit=crop&w=600&q=80' },
  { id: 'p2', name: 'Moringa Powder', category: 'Superfood', price: 180, image: 'https://images.unsplash.com/photo-1608757911896-d2b3f7d4179e?auto=format&fit=crop&w=600&q=80' },
  { id: 'p3', name: 'Curry Leaves Powder', category: 'Spice', price: 180, image: 'https://images.unsplash.com/photo-1546549038-3e4d7d0f65ff?auto=format&fit=crop&w=600&q=80' },
  { id: 'p4', name: 'Guava Powder', category: 'Fruit', price: 180, image: 'https://images.unsplash.com/photo-1512813382946-c4034ca85d48?auto=format&fit=crop&w=600&q=80' },
  { id: 'p5', name: 'Garlic Powder', category: 'Spice', price: 180, image: 'https://images.unsplash.com/photo-1512058564366-c9e3ca125b9c?auto=format&fit=crop&w=600&q=80' },
  { id: 'p6', name: 'Beetroot Powder', category: 'Superfood', price: 180, image: 'https://images.unsplash.com/photo-1582515073490-3998138632bd?auto=format&fit=crop&w=600&q=80' },
  { id: 'p7', name: 'Carrot Powder', category: 'Vegetable', price: 180, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=600&q=80' },
  { id: 'p8', name: 'Red Banana Powder', category: 'Fruit', price: 180, image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=600&q=80' },
  { id: 'p9', name: 'Bitter Gourd Powder', category: 'Vegetable', price: 180, image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=600&q=80' },
  { id: 'p10', name: 'Nendran Banana Powder', category: 'Fruit', price: 180, image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=600&q=80' }
];

const productListEl = document.getElementById('product-list');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const salesDailyEl = document.getElementById('sales-daily');
const salesWeeklyEl = document.getElementById('sales-weekly');
const salesMonthlyEl = document.getElementById('sales-monthly');
const salesYearlyEl = document.getElementById('sales-yearly');
const salesTableEl = document.getElementById('sales-table');
const filterStartEl = document.getElementById('filter-start');
const filterEndEl = document.getElementById('filter-end');
const productForm = document.getElementById('product-form');
const productIdEl = document.getElementById('product-id');
const productNameEl = document.getElementById('product-name');
const productCategoryEl = document.getElementById('product-category');
const productImageEl = document.getElementById('product-image');
const productPriceEl = document.getElementById('product-price');
const resetFormBtn = document.getElementById('reset-form');
const clearCartBtn = document.getElementById('clear-cart');
const printBillBtn = document.getElementById('print-bill');
const payNowBtn = document.getElementById('pay-now');
const infoButtons = document.querySelectorAll('.info-button');
const infoSection = document.getElementById('info');
const infoTitle = document.getElementById('info-title');
const infoText = document.getElementById('info-text');

let products = [];
let cart = [];
let sales = [];

function loadData() {
  const storedProducts = localStorage.getItem('shop-products');
  products = storedProducts ? JSON.parse(storedProducts) : defaultProducts.slice();
  const storedSales = localStorage.getItem('shop-sales');
  sales = storedSales ? JSON.parse(storedSales) : [];
  const storedCart = localStorage.getItem('shop-cart');
  cart = storedCart ? JSON.parse(storedCart) : [];
}

function saveData() {
  localStorage.setItem('shop-products', JSON.stringify(products));
  localStorage.setItem('shop-sales', JSON.stringify(sales));
  localStorage.setItem('shop-cart', JSON.stringify(cart));
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(value) {
  return value.toLocaleString('en-IN');
}

function renderProducts() {
  productListEl.innerHTML = '';
  if (!products.length) {
    productListEl.innerHTML = '<p class="empty-state">No products yet.</p>';
    return;
  }
  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image || 'https://via.placeholder.com/520x300?text=Product'}" alt="${product.name}" loading="lazy" />
      <h4>${product.name}</h4>
      <p>${product.category || 'General'}</p>
      <div class="product-meta">
        <span>₹${formatCurrency(product.price)}</span>
        <div>
          <button class="small-button" data-action="edit" data-id="${product.id}">Edit</button>
          <button class="small-button" data-action="delete" data-id="${product.id}">Delete</button>
        </div>
      </div>
    `;
    card.addEventListener('click', (event) => {
      const action = event.target.dataset.action;
      const id = event.target.dataset.id;
      if (action === 'edit') {
        event.stopPropagation();
        startEditProduct(id);
        return;
      }
      if (action === 'delete') {
        event.stopPropagation();
        deleteProduct(id);
        return;
      }
      addProductToCart(product.id);
    });
    productListEl.appendChild(card);
  });
}

function startEditProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  productIdEl.value = product.id;
  productNameEl.value = product.name;
  productCategoryEl.value = product.category;
  productImageEl.value = product.image;
  productPriceEl.value = product.price;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
  products = products.filter((product) => product.id !== id);
  saveData();
  renderProducts();
}

function resetForm() {
  productForm.reset();
  productIdEl.value = '';
  productPriceEl.value = 180;
}

function addProductToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
  }
  saveData();
  renderCart();
}

function removeCartItem(id) {
  cart = cart.filter((item) => item.id !== id);
  saveData();
  renderCart();
}

function renderCart() {
  cartItemsEl.innerHTML = '';
  if (!cart.length) {
    cartItemsEl.innerHTML = '<p class="empty-state">Cart is empty. Click a product to add it.</p>';
    cartCountEl.textContent = '0';
    cartTotalEl.textContent = '0';
    return;
  }
  cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <span>${item.quantity} × ₹${formatCurrency(item.price)} = ₹${formatCurrency(item.quantity * item.price)}</span>
      </div>
      <button type="button" aria-label="Remove ${item.name}" data-id="${item.id}">Remove</button>
    `;
    row.querySelector('button').addEventListener('click', () => removeCartItem(item.id));
    cartItemsEl.appendChild(row);
  });
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  cartCountEl.textContent = count;
  cartTotalEl.textContent = formatCurrency(total);
}

function clearCart() {
  cart = [];
  saveData();
  renderCart();
}

function recordSale() {
  if (!cart.length) return;
  const now = Date.now();
  const sale = {
    id: `sale-${now}`,
    date: now,
    items: cart.map((item) => ({ name: item.name, quantity: item.quantity })),
    total: cart.reduce((sum, item) => sum + item.quantity * item.price, 0)
  };
  sales.unshift(sale);
  clearCart();
  saveData();
  renderSales();
  alert('Sale recorded and payment complete.');
}

function renderSales(filterRange = null) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
  const startOfWeek = getStartOfWeek(now).getTime();

  const filteredSales = filterRange ? sales.filter((sale) => sale.date >= filterRange.start && sale.date <= filterRange.end) : sales;
  const daily = filteredSales.filter((sale) => sale.date >= startOfDay).reduce((sum, sale) => sum + sale.total, 0);
  const weekly = filteredSales.filter((sale) => sale.date >= startOfWeek).reduce((sum, sale) => sum + sale.total, 0);
  const monthly = filteredSales.filter((sale) => sale.date >= startOfMonth).reduce((sum, sale) => sum + sale.total, 0);
  const yearly = filteredSales.filter((sale) => sale.date >= startOfYear).reduce((sum, sale) => sum + sale.total, 0);

  salesDailyEl.textContent = `₹${formatCurrency(daily)}`;
  salesWeeklyEl.textContent = `₹${formatCurrency(weekly)}`;
  salesMonthlyEl.textContent = `₹${formatCurrency(monthly)}`;
  salesYearlyEl.textContent = `₹${formatCurrency(yearly)}`;

  salesTableEl.innerHTML = '';
  if (!filteredSales.length) {
    salesTableEl.innerHTML = '<tr><td colspan="3">No sales found for this range.</td></tr>';
    return;
  }
  filteredSales.forEach((sale) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(sale.date)}</td>
      <td>${sale.items.map((item) => `${item.name} (${item.quantity})`).join(', ')}</td>
      <td>₹${formatCurrency(sale.total)}</td>
    `;
    salesTableEl.appendChild(row);
  });
}

function getStartOfWeek(date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function getFilteredRange() {
  const start = filterStartEl.value ? new Date(filterStartEl.value).getTime() : null;
  const end = filterEndEl.value ? new Date(filterEndEl.value).getTime() + 86399999 : null;
  if (start && end && start > end) {
    alert('Start date should be earlier than end date.');
    return null;
  }
  return start || end ? { start: start || 0, end: end || Date.now() } : null;
}

productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = productIdEl.value || `p-${Date.now()}`;
  const name = productNameEl.value.trim();
  const category = productCategoryEl.value.trim();
  const image = productImageEl.value.trim();
  const price = Number(productPriceEl.value) || 180;

  const existingIndex = products.findIndex((product) => product.id === id);
  const productData = { id, name, category, image, price };
  if (existingIndex >= 0) {
    products[existingIndex] = productData;
  } else {
    products.push(productData);
  }

  saveData();
  renderProducts();
  resetForm();
});

resetFormBtn.addEventListener('click', resetForm);
clearCartBtn.addEventListener('click', () => {
  if (confirm('Clear all items from the cart?')) clearCart();
});
printBillBtn.addEventListener('click', () => {
  if (!cart.length) {
    alert('Cart is empty. Add items before printing bill.');
    return;
  }
  window.print();
});
payNowBtn.addEventListener('click', () => {
  if (!cart.length) {
    alert('Add a product to the cart before paying.');
    return;
  }
  recordSale();
});

infoButtons.forEach((button) => {
  button.addEventListener('click', () => {
    infoSection.classList.remove('hidden');
    const target = button.dataset.target;
    if (target === 'about') {
      infoTitle.textContent = 'About the Product';
      infoText.textContent = 'Every product is priced at ₹180. Add items directly to the cart and use the sales dashboard to track income instantly.';
    } else if (target === 'use') {
      infoTitle.textContent = 'How to use it';
      infoText.textContent = 'Create or edit products in the manager, click product cards to add them to the cart, then choose Pay now or Print bill to record the transaction.';
    } else {
      infoTitle.textContent = 'Contact details';
      infoText.textContent = 'Customer support is available on WhatsApp or email. Use the payment QR code to collect payments instantly with GPay or any UPI app.';
    }
    infoSection.scrollIntoView({ behavior: 'smooth' });
  });
});

filterStartEl.addEventListener('change', () => renderSales(getFilteredRange()));
filterEndEl.addEventListener('change', () => renderSales(getFilteredRange()));

document.getElementById('apply-filter').addEventListener('click', () => {
  const range = getFilteredRange();
  renderSales(range);
});

document.getElementById('reset-filter').addEventListener('click', () => {
  filterStartEl.value = '';
  filterEndEl.value = '';
  renderSales();
});

loadData();
renderProducts();
renderCart();
renderSales();
