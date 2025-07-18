from django.db import models
from django.utils import timezone
import json
from django.conf import settings  # Add this import at the top
from django.contrib.auth import get_user_model  # Add this import

User = get_user_model()  # Get the user model

# Size choices used for both Clothes and Orders
SIZE_CHOICES = [
    ("S", "Small"),
    ("M", "Medium"),
    ("L", "Large"),
    ("xl", "X-Large"),
    ("xxl", "XX-Large"),
    ("xxxl", "XXX-Large")
]


class Clothes(models.Model):
    name = models.CharField(blank=False, null=False, max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='users_imgs')
    description = models.TextField(max_length=200)
    size = models.CharField(choices=SIZE_CHOICES, max_length=5, blank=True)


    class Meta:
        verbose_name_plural = 'clothes'

    def __str__(self):
        return self.name

    def get_color_list(self):
        """Returns available_colors as a list of trimmed color names"""
        if self.available_colors:
            return [color.strip() for color in self.available_colors.split(',')]
        return []

from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Cart(models.Model):
    session_key = models.CharField(max_length=40, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Cart"
        verbose_name_plural = "Carts"

    def __str__(self):
        return f"Cart {self.id}"

    @property
    def item_count(self):
        """Returns total number of items in cart (preferred method)"""
        return self.cartitem_set.count()

    # Alias for item_count for backward compatibility
    get_item_count = item_count

    @property
    def items(self):
        """Returns all cart items"""
        return self.cartitem_set.all()

    @property
    def total_price(self):
        """Returns total price of all items in cart"""
        return sum(item.total_price for item in self.cartitem_set.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey('Clothes', on_delete=models.CASCADE)
    size = models.CharField(max_length=10)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Cart Item"
        verbose_name_plural = "Cart Items"

    def __str__(self):
        return f"{self.quantity}x {self.product.name} (Size: {self.size})"

    @property
    def line_total(self):
        """Calculate total price for this line item"""
        return self.quantity * self.product.price  

    def __str__(self):
        return f"{self.quantity}x {self.product.name} (Size: {self.size})"

    @property
    def total_price(self):
        """Returns total price for this cart item"""
        return self.product.price * self.quantity

#models.py added at the end of the whole code
#=========================================================================
class Order(models.Model):
    product = models.ForeignKey(Clothes, on_delete=models.CASCADE)
    color = models.CharField(max_length=50)
    size = models.CharField(max_length=5, choices=SIZE_CHOICES)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ordered {self.product.name} ({self.size})"
#=========================================================================

from django.utils import timezone
import json

class CartOrder(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    message = models.TextField(blank=True)
    items = models.TextField(help_text="Stores cart items as JSON")
    total_price = models.FloatField()
    created_at = models.DateTimeField(default=timezone.now)

    def get_items(self):
        return json.loads(self.items)

    def __str__(self):
        return f"Cart Order by {self.name} at {self.created_at}"
