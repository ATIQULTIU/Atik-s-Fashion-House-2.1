const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const productCards = $$('.product-card');
const productGrid = $('#productGrid');
const emptyState = $('#emptyState');
const searchPanel = $('#searchPanel');
const searchInput = $('#searchInput');
const cartDrawer = $('#cartDrawer');
const bagOverlay = $('#bagOverlay');
const toast = $('#toast');

let activeFilter = 'All';
let searchTerm = '';
let cart = [];

function money(value) {
  return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value).replace('BDT', '৳').replace(/\s/g, '');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function updateProducts() {
  const sort = $('#sortSelect').value;
  const visible = productCards.filter(card => {
    const matchesFilter = activeFilter === 'All' || card.dataset.category === activeFilter;
    const haystack = `${card.dataset.name} ${card.dataset.category} ${card.dataset.color}`.toLowerCase();
    return matchesFilter && haystack.includes(searchTerm);
  });
  productCards.forEach(card => card.hidden = !visible.includes(card));
  if (sort === 'low') visible.sort((a, b) => +a.dataset.price - +b.dataset.price);
  if (sort === 'high') visible.sort((a, b) => +b.dataset.price - +a.dataset.price);
  visible.forEach(card => productGrid.appendChild(card));
  emptyState.hidden = visible.length > 0;
}

$('#filterChips').addEventListener('click', event => {
  const chip = event.target.closest('[data-filter]');
  if (!chip) return;
  activeFilter = chip.dataset.filter;
  $$('.chip').forEach(item => item.classList.toggle('active', item === chip));
  updateProducts();
});
$('#sortSelect').addEventListener('change', updateProducts);
$('#searchToggle').addEventListener('click', () => {
  searchPanel.hidden = false;
  searchInput.focus();
});
$('#searchClose').addEventListener('click', () => {
  searchPanel.hidden = true;
  searchInput.value = '';
  searchTerm = '';
  updateProducts();
});
searchInput.addEventListener('input', () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  updateProducts();
  if (searchTerm) $('#shop').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const navLinks = $('#navLinks');
$('#mobileMenu').addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  $('#mobileMenu').setAttribute('aria-expanded', String(isOpen));
  $('#mobileMenu').textContent = isOpen ? '×' : '☰';
});
$$('#navLinks a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  $('#mobileMenu').setAttribute('aria-expanded', 'false');
  $('#mobileMenu').textContent = '☰';
}));

function addToCart(card) {
  const id = card.dataset.id;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({
    id, name: card.dataset.name, price: +card.dataset.price,
    image: card.dataset.image, color: card.dataset.color, qty: 1
  });
  renderCart();
  showToast(`${card.dataset.name} added to your bag`);
}
productGrid.addEventListener('click', event => {
  const button = event.target.closest('.quick-add');
  if (button) addToCart(button.closest('.product-card'));
});

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  $('#bagCount').textContent = count;
  $('#drawerCount').textContent = `(${count})`;
  $('#cartTotal').textContent = money(total);
  const cartItems = $('#cartItems');
  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Your bag is waiting for something good.</p>';
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-row" data-cart-id="${item.id}">
      <img src="${item.image}" alt="${item.name}">
      <div><h3>${item.name}</h3><p>${item.color} · ${money(item.price)}</p>
        <div class="qty-controls"><button data-action="minus" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-action="plus" aria-label="Increase quantity">+</button></div>
      </div>
      <button class="remove-item" data-action="remove" aria-label="Remove ${item.name}">×</button>
    </div>`).join('');
}
function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  bagOverlay.hidden = false;
  document.body.classList.add('locked');
  $('#bagClose').focus();
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  bagOverlay.hidden = true;
  document.body.classList.remove('locked');
}
$('#bagOpen').addEventListener('click', openCart);
$('#bagClose').addEventListener('click', closeCart);
bagOverlay.addEventListener('click', closeCart);
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeCart(); searchPanel.hidden = true; } });
$('#cartItems').addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const row = button.closest('[data-cart-id]');
  const item = cart.find(product => product.id === row.dataset.cartId);
  if (!item) return;
  if (button.dataset.action === 'plus') item.qty += 1;
  if (button.dataset.action === 'minus') item.qty -= 1;
  if (button.dataset.action === 'remove' || item.qty <= 0) cart = cart.filter(product => product.id !== item.id);
  renderCart();
});
$('#checkoutButton').addEventListener('click', () => {
  $('#checkoutNote').textContent = cart.length
    ? 'Demo only: connect a secure checkout and payment provider to accept orders.'
    : 'Your bag is empty. Add a piece you love first.';
  showToast(cart.length ? 'Checkout is a demo feature for now' : 'Your bag is empty');
});
$('#newsletterForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = $('#emailInput').value.trim();
  if (!email) return;
  $('#newsletterMessage').textContent = 'Thanks for joining the list! This demo does not send emails yet.';
  $('#emailInput').value = '';
  showToast('Thanks for your interest!');
});
$('#year').textContent = new Date().getFullYear();

const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 }) : null;
$$('.reveal').forEach(element => {
  if (observer) observer.observe(element);
  else element.classList.add('visible');
});
updateProducts();
