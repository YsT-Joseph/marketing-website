{% load static i18n humanize %}
<!DOCTYPE html>
<html lang="{{ LANGUAGE_CODE }}" data-theme="light" dir="{% if LANGUAGE_BIDI %}rtl{% else %}ltr{% endif %}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% trans "MALAZ store" %}</title>
  <link rel="stylesheet" href="{% static 'css/home.css' %}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
    :root {
      --dark-mode-icon: '\f186';
      --light-mode-icon: '\f185';
    }

    .elegance-hero {
      background: 
        linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), 
        url('https://thumbs.dreamstime.com/b/rack-vintage-winter-outwear-coats-jackets-hanging-metal-pipes-outdoor-colorful-garment-various-colors-texture-second-hand-367502534.jpg') 
        center center / cover no-repeat;
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0 2rem 0;
      border-radius: 12px;
      overflow: hidden;
    }

    [data-theme="dark"] .elegance-hero {
      background: 
        linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), 
        url('https://thumbs.dreamstime.com/b/rack-vintage-winter-outwear-coats-jackets-hanging-metal-pipes-outdoor-colorful-garment-various-colors-texture-second-hand-367502534.jpg') 
        center center / cover no-repeat;
    }

    .elegance-content {
      text-align: center;
      color: white;
      z-index: 2;
      padding: 2rem;
    }
    .elegance-content h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
      font-weight: 700;
    }
    .elegance-content p {
      font-size: 1.4rem;
      margin-bottom: 2.5rem;
      text-shadow: 1px 1px 6px rgba(0,0,0,0.4);
    }
    @media (max-width: 768px) {
      .elegance-content h1 { font-size: 2.2rem; }
      .elegance-content p { font-size: 1.1rem; }
    }

    .color-select {
      padding: 6px 10px;
      border: 1px solid #aaa;
      border-radius: 4px;
      font-size: 0.9rem;
      background-color: #f5f5f5;
      color: #333;
      margin-bottom: 1rem;
    }
    [data-theme="dark"] .color-select {
      background-color: #444;
      color: #eee;
      border-color: #777;
    }
  </style>
</head>
<body>
  {% include 'navbar.html' %}

  <div class="offer-banner">
    <p class="offer-text">{% trans "Buy 2 Shirts and get 30% off the third item." %}</p>
    <div class="timer" id="countdown-timer">04:00:00</div>
  </div>

  <section class="elegance-hero">
    <div class="elegance-content">
      <h1>{% trans "Dress with Elegance and Confidence." %}</h1>
      <p>{% trans "Discover the latest trends in men's fashion and redefine your style." %}</p>
      <button class="shop-now" id="shop-now-btn">{% trans "Shop Now" %}</button>
    </div>
  </section>

  <section class="featured-products" id="featured-products">
    <h2>{% trans "Featured Products" %}</h2>
    <div class="products-grid">
      {% for item in clothes %}
      <div class="product-card">
        <div class="product-image">
          <img src="{{ item.image.url }}" alt="{{ item.name }}" loading="lazy">
        </div>
        <div class="product-info">
          <h3>{{ item.name }}</h3>
          <p class="price">{{ item.price|intcomma }} {% trans "ج.م" %}</p>
          <p class="description">{{ item.description }}</p>

          {% if item.get_color_list %}
          <div class="available-colors">
            <label for="color-select-{{ item.id }}">{% trans "Available Colors:" %}</label><br>
            <select class="color-select" id="color-select-{{ item.id }}">
              <option value="">{% trans "Select a color" %}</option>
              {% for color in item.get_color_list %}
              <option value="{{ color }}">{{ color }}</option>
              {% endfor %}
            </select>
          </div>
          {% endif %}

          <div class="size-options">
            <label for="size-select-{{ item.id }}">{% trans "Size:" %}</label>
            <select class="size-select" id="size-select-{{ item.id }}">
              {% for value, label in size_choices %}
              <option value="{{ value }}">{{ label }}</option>
              {% endfor %}
            </select>
          </div>

          <button class="confirm-btn" data-product-id="{{ item.id }}" data-product-name="{{ item.name }}">
            {% trans "Confirm Order" %}
          </button>
        </div>
      </div>
      {% empty %}
      <p class="no-products">{% trans "No products found." %}</p>
      {% endfor %}
    </div>
  </section>

  {% include 'order_modal.html' %}  {# assumes modal is in a partial #}

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      document.documentElement.setAttribute('data-theme',
        localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      );

      // 🛒 Confirm Order
      document.querySelectorAll('.confirm-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          const card = btn.closest('.product-card');
          const productId = btn.dataset.productId;
          const productName = btn.dataset.productName;

          const colorSelect = card.querySelector('.color-select');
          const sizeSelect = card.querySelector('.size-select');

          const selectedColor = colorSelect?.value || '';
          const selectedSize = sizeSelect?.value || '';
          const sizeText = sizeSelect?.selectedOptions[0]?.text || '';

          if (!selectedColor) {
            showAlert('Please select a color!', 'error');
            return;
          }

          document.getElementById('product-id').value = productId;
          document.getElementById('selected-color').value = selectedColor;
          document.getElementById('selected-size').value = selectedSize;

          document.getElementById('order-product-name').textContent = productName;
          document.getElementById('display-color').textContent = selectedColor;
          document.getElementById('display-size').textContent = sizeText;

          const modal = document.getElementById('order-modal');
          modal.classList.add('show');
          setTimeout(() => modal.classList.add('active'), 10);
          document.body.style.overflow = 'hidden';
        });
      });

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

        if (document.documentElement.getAttribute('data-theme') === 'dark') {
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
  </script>
</body>
</html>
