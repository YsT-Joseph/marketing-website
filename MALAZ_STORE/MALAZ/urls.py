from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('make_order/', views.make_order, name='make_order'),
    path('product/<int:pk>/', views.product_detail, name='product_detail'),

    path('orders/', views.order_list, name='order_list'),
    path('cart/', views.cart_view, name='cart_view'),
    path('add-to-cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('confirm-cart-order/', views.confirm_cart_order, name='confirm_cart_order'),
    path('cart-order-confirmation/', views.cart_order_confirmation, name='cart_order_confirmation'),  # <== add this
    path('order/confirm/', views.make_order, name='make_order'),
    path('order/confirmation/', views.cart_order_confirmation, name='cart_order_confirmation'),
]
