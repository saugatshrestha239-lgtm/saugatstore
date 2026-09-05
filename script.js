const cart = [];
const cartDrawer = document.querySelector('.cart-drawer');
const overlay = document.querySelector('.drawer-overlay');
const toast = document.querySelector('.toast');
const formatPrice = price => `Rs. ${price.toLocaleString('en-IN')}`;
const whatsappNumber = '9779849522900';

function openCart() {
  cartDrawer.classList.add('open');
  overlay.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
}
function renderCart() {
  const items = document.querySelector('.cart-items');
  const empty = document.querySelector('.cart-empty');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.querySelector('.bag-count').textContent = cart.length;
  document.querySelector('.drawer-count').textContent = `(${cart.length})`;
  document.querySelector('.cart-total').textContent = formatPrice(total);
  empty.hidden = cart.length > 0;
  items.innerHTML = cart.map((item, index) => `<div class="cart-item"><img src="${item.image}" alt="${item.name}"><div class="cart-item-info"><h3>${item.name}</h3><p>One size / Standard</p><strong>${formatPrice(item.price)}</strong></div><button class="remove-item" data-index="${index}" aria-label="Remove ${item.name}">×</button></div>`).join('');
  items.querySelectorAll('.remove-item').forEach(button => button.addEventListener('click', () => {
    cart.splice(Number(button.dataset.index), 1);
    renderCart();
  }));
}

document.querySelectorAll('[data-cart]').forEach(button => button.addEventListener('click', openCart));
document.querySelectorAll('[data-close-cart]').forEach(button => button.addEventListener('click', closeCart));
document.querySelectorAll('.quick-add').forEach(button => button.addEventListener('click', () => {
  const image = button.closest('.product-image').querySelector('img').src;
  cart.push({ name: button.dataset.product, price: Number(button.dataset.price), image });
  renderCart();
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1800);
}));

document.querySelectorAll('.filter-tabs button').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.filter-tabs button.active').classList.remove('active');
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.product-card').forEach(card => {
    card.hidden = filter !== 'all' && !card.dataset.category.includes(filter);
  });
}));

document.querySelector('.menu-toggle').addEventListener('click', event => {
  const header = document.querySelector('.site-header');
  const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
  event.currentTarget.setAttribute('aria-expanded', String(!expanded));
  header.classList.toggle('menu-open', !expanded);
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => document.querySelector('.site-header').classList.remove('menu-open')));
document.querySelector('.signup-form').addEventListener('submit', event => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.textContent = '✓';
  event.currentTarget.querySelector('input').value = '';
  event.currentTarget.querySelector('input').placeholder = 'You are on the list';
});
document.querySelector('.checkout-button').addEventListener('click', () => {
  if (!cart.length) {
    toast.textContent = 'Add an item before ordering';
    toast.classList.add('show');
    window.setTimeout(() => {
      toast.classList.remove('show');
      toast.textContent = 'Added to your bag';
    }, 1800);
    return;
  }
  const items = cart.map(item => `- ${item.name}: ${formatPrice(item.price)}`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const message = `Hello, I would like to place an order:\n\n${items}\n\nSubtotal: ${formatPrice(total)}\n\nName:\nDelivery address:\nPhone:`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
renderCart();
