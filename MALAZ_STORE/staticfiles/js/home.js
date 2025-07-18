document.addEventListener('DOMContentLoaded', function () {
  // 🌙 Theme Setting
  document.documentElement.setAttribute(
    'data-theme',
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  // 🛒 Confirm Order Modal Logic - Updated for size selection only
  document.querySelectorAll('.confirm-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      
      const productId = btn.dataset.productId;
      const productName = btn.dataset.productName;
      const sizeSelect = document.getElementById('size-select');
      
      const selectedSize = sizeSelect?.value || '';
      const sizeText = sizeSelect?.selectedOptions[0]?.text || '';

      // Validate size selection
      if (!selectedSize) {
        showAlert('Please select a size!', 'error');
        return;
      }

      // Set form values
      document.getElementById('product-id').value = productId;
      document.getElementById('selected-size').value = selectedSize;
      
      // Update order summary display
      document.getElementById('order-product-name').textContent = `Product: ${productName}`;
      document.getElementById('display-size').textContent = sizeText;

      // Show modal with animation
      const modal = document.getElementById('order-modal');
      modal.classList.add('show');
      setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }, 10);
    });
  });

  // ❌ Close Modal
  document.querySelectorAll('.close-modal, #order-modal').forEach(el => {
    el.addEventListener('click', function (e) {
      if (e.target.classList.contains('close-modal') || e.target.id === 'order-modal') {
        const modal = document.getElementById('order-modal');
        modal.classList.remove('active');
        setTimeout(() => {
          modal.classList.remove('show');
          document.body.style.overflow = 'auto';
        }, 300);
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('order-modal');
      if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.classList.remove('show');
          document.body.style.overflow = 'auto';
        }, 300);
      }
    }
  });

  // 🔔 Alert
  function showAlert(message, type = 'error') {
    const existing = document.querySelector('.custom-alert');
    if (existing) existing.remove();

    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.zIndex = 9999;
    alert.style.padding = '12px 24px';
    alert.style.borderRadius = '4px';
    alert.style.fontWeight = '500';
    alert.style.transition = 'opacity 0.3s ease';
    alert.style.opacity = '0';

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      alert.style.backgroundColor = type === 'error' ? '#4b1111' : '#1b3a1e';
      alert.style.color = type === 'error' ? '#ffcdd2' : '#a5d6a7';
    } else {
      alert.style.backgroundColor = type === 'error' ? '#ffebee' : '#e8f5e9';
      alert.style.color = type === 'error' ? '#c62828' : '#2e7d32';
    }

    document.body.appendChild(alert);
    requestAnimationFrame(() => alert.style.opacity = '1');

    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }, 3000);
  }

  // 🛍️ Shop Now Scroll
  const shopNowBtn = document.getElementById("shop-now-btn");
  if (shopNowBtn) {
    shopNowBtn.addEventListener("click", function () {
      const target = document.getElementById("featured-products");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // ⏳ Persistent Countdown Timer (4 hours)
  const timerEl = document.getElementById("countdown-timer");
  const FOUR_HOURS = 4 * 60 * 60 * 1000;
  if (timerEl) {
    let start = localStorage.getItem('timerStart');
    const now = Date.now();
    if (!start || now - start > FOUR_HOURS) {
      start = now;
      localStorage.setItem('timerStart', start);
    }

    function updateTimer() {
      const current = Date.now();
      let elapsed = current - start;
      if (elapsed >= FOUR_HOURS) {
        start = current;
        localStorage.setItem('timerStart', start);
        elapsed = 0;
      }
      const remaining = Math.floor((FOUR_HOURS - elapsed) / 1000);
      const hrs = String(Math.floor(remaining / 3600)).padStart(2, '0');
      const mins = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
      const secs = String(remaining % 60).padStart(2, '0');
      timerEl.textContent = `${hrs}:${mins}:${secs}`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }
});