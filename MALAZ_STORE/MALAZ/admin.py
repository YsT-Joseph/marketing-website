from django.contrib import admin
from .models import Clothes, Order

# Define admin settings directly (or import from settings.py)
admin.site.site_header = "MALAZ STORE Admin"  # Replace with your actual header
admin.site.site_title = "MALAZ STORE Admin Portal"  # Replace with your title
admin.site.index_title = "Welcome to MALAZ STORE Administration"  # Replace with your index title

# Register your models
admin.site.register(Clothes)
