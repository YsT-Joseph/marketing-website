document.addEventListener('DOMContentLoaded', function() {
  const orderModal = document.getElementById('order-modal');
  const orderForm = document.getElementById('order-form');

  if (!orderModal || !orderForm) {
    console.error('Modal or form missing in HTML!');
    return;
  }

  // 🎨 Color selection
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('color-option')) {
      const parent = e.target.closest('.product-card');
      parent.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
      e.target.classList.add('selected');
    }
  });

  // ✅ Confirm Order button
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('confirm-btn')) {
      const card = e.target.closest('.product-card');
      const selectedColor = card.querySelector('.color-option.selected')?.dataset.color;
      const selectedSize = card.querySelector('.size-select').value;
      const sizeText = card.querySelector('.size-select option:checked').textContent;
      const productId = e.target.dataset.productId;
      const productName = e.target.dataset.productName;

      if (!selectedColor) {
        alert('Please select a color!');
        return;
      }

      document.getElementById('order-product-name').textContent = `Product: ${productName}`;
      document.getElementById('display-color').textContent = selectedColor.toUpperCase();
      document.getElementById('display-size').textContent = sizeText;
      document.getElementById('selected-color').value = selectedColor;
      document.getElementById('selected-size').value = selectedSize;
      document.getElementById('product-id').value = productId;

      orderModal.classList.add('active');
    }
  });

  // ❌ Close modal buttons & backdrop
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-modal')) {
      orderModal.classList.remove('active');
    }
  });

  orderModal.addEventListener('click', function(e) {
    if (e.target === this) {
      orderModal.classList.remove('active');
    }
  });

  // 📦 Submit order via fetch
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(orderForm);
    const csrfToken = formData.get('csrfmiddlewaretoken');

    fetch('/make_order/', {
      method: 'POST',
      body: formData,
      headers: {'X-CSRFToken': csrfToken}
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Order placed successfully!');
        orderForm.reset();
        orderModal.classList.remove('active');
      } else {
        alert('Error: ' + (data.message || 'Unknown error'));
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });
  });

  console.log("designed by: Moustafa Ahmed Fawzy & Youssef Mohamed Samir");
});
