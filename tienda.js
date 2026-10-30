document.addEventListener('DOMContentLoaded', () => {
  const STRIPE_LINK = 'https://buy.stripe.com/bJe8wQ0mZ2pX9Evaa7fw400';
  let cart = [];

  const tabButtons = document.querySelectorAll('[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabKey = button.getAttribute('data-tab');

      tabContents.forEach(el => el.classList.add('hidden'));
      tabButtons.forEach(el => el.classList.remove('active'));

      document.getElementById(`sec-${tabKey}`)?.classList.remove('hidden');
      button.classList.add('active');
    });
  });

  const toggleCartDrawer = () => {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) drawer.classList.toggle('hidden');
  };

  const updateCartUI = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.innerText = totalQuantity;

    if (cart.length === 0) {
      if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '<p class="text-xs text-slate-400 text-center py-8">Tu carrito está vacío.</p>';
      }
      if (cartTotal) cartTotal.innerText = '0 €';
      return;
    }

    let total = 0;
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl text-xs';
      itemEl.innerHTML = `
        <div>
          <h4 class="font-bold text-[#0A3B7A]">${item.title}</h4>
          <span class="text-slate-400">${item.quantity} x ${item.price} €</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-bold text-[#1F8A65]">${itemTotal} €</span>
          <button data-remove-item="${item.title}" class="text-slate-400 hover:text-red-500 font-bold cursor-pointer">✕</button>
        </div>
      `;
      cartItemsContainer?.appendChild(itemEl);
    });

    if (cartTotal) cartTotal.innerText = `${total} €`;

    document.querySelectorAll('[data-remove-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-remove-item');
        cart = cart.filter(item => item.title !== title);
        updateCartUI();
      });
    });
  };

  document.querySelectorAll('[data-add-item]').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-add-item');
      const price = parseFloat(btn.getAttribute('data-price') || '0');

      const existing = cart.find(item => item.title === title);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ title, price, quantity: 1 });
      }

      updateCartUI();
      toggleCartDrawer();
    });
  });

  document.getElementById('cart-toggle-btn')?.addEventListener('click', toggleCartDrawer);
  document.getElementById('cart-close-btn')?.addEventListener('click', toggleCartDrawer);

  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Agrega al menos un producto antes de continuar.');
      return;
    }
    window.location.href = STRIPE_LINK;
  });
});
