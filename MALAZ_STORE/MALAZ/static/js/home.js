document.addEventListener('DOMContentLoaded', function() {
  // =====================
  // 1. THEME MANAGEMENT
  // =====================
  const initTheme = () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    html.setAttribute('data-theme', savedTheme);

    if (darkIcon && lightIcon) {
      darkIcon.style.display = savedTheme === 'light' ? 'block' : 'none';
      lightIcon.style.display = savedTheme === 'dark' ? 'block' : 'none';

      themeToggle?.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
          darkIcon.style.opacity = '0';
          setTimeout(() => {
            darkIcon.style.display = 'none';
            lightIcon.style.display = 'block';
            lightIcon.style.opacity = '1';
          }, 150);
        } else {
          lightIcon.style.opacity = '0';
          setTimeout(() => {
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
            darkIcon.style.opacity = '1';
          }, 150);
        }
      });
    }
  };
  initTheme();

  // =====================
  // 2. LANGUAGE SELECTOR
  // =====================
  const initLanguageSelector = () => {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) return;

    languageSelect.value = document.documentElement.lang || 'en';

    languageSelect.addEventListener('change', async function() {
      const csrfToken = getCookie('csrftoken');
      if (!csrfToken) {
        showAlert('Security error. Please refresh the page.', 'error');
        return;
      }

      try {
        const response = await fetch('/i18n/setlang/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken
          },
          body: `language=${this.value}`
        });

        if (response.ok) {
          window.location.reload();
        } else {
          showAlert('Failed to change language. Please try again.', 'error');
        }
      } catch (error) {
        showAlert('Network error. Please check your connection.', 'error');
      }
    });
  };
  initLanguageSelector();

  // =====================
  // 3. COUNTDOWN TIMER
  // =====================
  const initCountdownTimer = () => {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;

    let timeLeft = parseInt(localStorage.getItem('offerTimeLeft')) || 14400;
    let timerInterval;

    const formatTime = (seconds) => {
      const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      return `${h}:${m}:${s}`;
    };

    const updateTimer = () => {
      timerElement.textContent = formatTime(timeLeft);
      localStorage.setItem('offerTimeLeft', timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        setTimeout(() => {
          timeLeft = 14400;
          timerInterval = setInterval(updateTimer, 1000);
        }, 1000);
      }
    };

    updateTimer();
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimer();
    }, 1000);

    window.addEventListener('beforeunload', () => {
      clearInterval(timerInterval);
    });
  };
  initCountdownTimer();

  // =====================
  // 4. SCROLL TO PRODUCTS
  // =====================
  const initShopNowButton = () => {
    const shopNowBtn = document.getElementById('shop-now-btn');
    const featuredProducts = document.getElementById('featured-products');

    if (shopNowBtn && featuredProducts) {
      shopNowBtn.addEventListener('click', (e) => {
        e.preventDefault();

        shopNowBtn.classList.add('clicked');
        setTimeout(() => shopNowBtn.classList.remove('clicked'), 300);

        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = featuredProducts.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    }
  };
  initShopNowButton();

  // =====================
  // 5. ORDER MODAL SYSTEM
  // =====================
  const initOrderModal = () => {
    const orderModal = document.getElementById('order-modal');
    if (!orderModal) return;

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('color-option')) {
        const card = e.target.closest('.product-card');
        if (!card) return;

        card.querySelectorAll('.color-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        e.target.classList.add('selected');
      }
    });

    const openModal = (productData) => {
      document.getElementById('order-product-name').textContent = productData.name;
      document.getElementById('display-color').textContent = productData.colorName || productData.color.toUpperCase();
      document.getElementById('display-size').textContent = productData.sizeText;
      document.getElementById('selected-color').value = productData.colorName || productData.color;
      document.getElementById('selected-size').value = productData.size;
      document.getElementById('product-id').value = productData.id;

      orderModal.classList.add('show');
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        orderModal.classList.add('active');
      }, 10);
    };

    const closeModal = () => {
      orderModal.classList.remove('active');
      setTimeout(() => {
        orderModal.classList.remove('show');
        document.body.style.overflow = 'auto';
      }, 300);
    };

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('confirm-btn')) {
        const card = e.target.closest('.product-card');
        if (!card) return;

        const selectedColorElem = card.querySelector('.color-option.selected');
        const selectedColor = selectedColorElem?.dataset.color;
        const selectedColorName = selectedColorElem?.dataset.colorName || selectedColor?.toUpperCase();
        const sizeSelect = card.querySelector('.size-select');
        const selectedSize = sizeSelect.value;
        const sizeText = sizeSelect.options[sizeSelect.selectedIndex].text;

        if (!selectedColor) {
          showAlert('Please select a color!', 'error');
          return;
        }

        openModal({
          id: e.target.dataset.productId,
          name: e.target.dataset.productName,
          color: selectedColor,
          colorName: selectedColorName,
          size: selectedSize,
          sizeText: sizeText
        });
      }
    });

    orderModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-modal') || e.target === orderModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && orderModal.classList.contains('active')) {
        closeModal();
      }
    });
  };
  initOrderModal();

  // =====================
  // 6. ORDER FORM SUBMIT
  // =====================
  const initOrderForm = () => {
    const orderForm = document.getElementById('order-form');
    if (!orderForm) return;

    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = orderForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.textContent;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        const csrfToken = getCookie('csrftoken');
        if (!csrfToken) throw new Error('CSRF token missing');

        const formData = new FormData(orderForm);
        const response = await fetch(orderForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'X-CSRFToken': csrfToken }
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to place order');

        showAlert('Order placed successfully!', 'success');
        orderForm.reset();
        document.querySelector('.order-modal')?.classList.remove('active', 'show');
        document.body.style.overflow = 'auto';

      } catch (error) {
        showAlert(error.message || 'An error occurred. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  };
  initOrderForm();

  // =====================
  // 7. UTILITIES
  // =====================
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function showAlert(message, type = 'error') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.setAttribute('aria-live', 'polite');
    alert.textContent = message;
    document.body.appendChild(alert);

    void alert.offsetWidth;
    alert.style.opacity = '1';

    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }, 3000);
  }

  // =====================
  // 8. ALERT STYLE INJECTION
  // =====================
  if (!document.querySelector('style[data-alert-styles]')) {
    const style = document.createElement('style');
    style.dataset.alertStyles = 'true';
    style.textContent = `
      .custom-alert {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        padding: 12px 24px;
        border-radius: 4px;
        font-weight: 500;
        z-index: 9999;
        transition: opacity 0.3s ease, transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 90%;
        text-align: center;
      }
      [data-theme="light"] .custom-alert.error {
        background: #ffebee;
        color: #c62828;
        border-left: 4px solid #c62828;
      }
      [data-theme="dark"] .custom-alert.error {
        background: #4b1111;
        color: #ffcdd2;
        border-left: 4px solid #ef9a9a;
      }
      [data-theme="light"] .custom-alert.success {
        background: #e8f5e9;
        color: #2e7d32;
        border-left: 4px solid #2e7d32;
      }
      [data-theme="dark"] .custom-alert.success {
        background: #1b3a1e;
        color: #a5d6a7;
        border-left: 4px solid #81c784;
      }
    `;
    document.head.appendChild(style);
  }
});
