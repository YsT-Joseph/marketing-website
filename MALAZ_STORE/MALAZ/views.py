from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseForbidden
from .models import Clothes, Order, Cart, CartItem
from datetime import datetime

@csrf_exempt
def make_order(request):
    if request.method == 'POST':
        try:
            product_id = request.POST.get('product_id')
            product = Clothes.objects.get(id=product_id)
            size = request.POST.get('size')
            phone = request.POST.get('phone')
            name = request.POST.get('name')
            address = request.POST.get('address')
            
            # Create the order
            Order.objects.create(
                product=product,
                size=size,
                name=name,
                phone=phone,
                address=address,
                message=f"New order for {product.name} (Size: {size})"
            )
            
            # Return JSON response with redirect URL
            return JsonResponse({
                'status': 'success',
                'redirect_url': '/order/confirmation/'  # Direct URL path
            })
                
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)

def cart_order_confirmation(request):
    return render(request, 'orders/cart_order_confirmation.html', {
        'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })


def home(request):
    clothes = Clothes.objects.all()
    size_choices = Clothes._meta.get_field('size').choices
    
    # Get cart count
    cart_count = 0
    if request.session.session_key:
        cart = Cart.objects.filter(session_key=request.session.session_key).first()
        if cart:
            cart_count = cart.items.count()
    
    return render(request, 'home.html', {
        'clothes': clothes,
        'size_choices': size_choices,
        'cart_count': cart_count  # Add this
    })


#views.py at the end of the whole code
#make sure u imported these 1- from django.http import HttpResponseForbidden & 2- from .models import Order
#===================================================================
# ✅ New view: admin-only order list
def order_list(request):
    if not request.user.is_authenticated or not request.user.is_staff:
        return HttpResponseForbidden("You are not allowed to view this page.")

    orders = Order.objects.all().order_by('-created_at')
    return render(request, 'orders/order_list.html', {
        'orders': orders
    })
#===================================================================

def product_detail(request, pk):
    product = get_object_or_404(Clothes, pk=pk)
    size_choices = Clothes._meta.get_field('size').choices
    
    # Get cart count
    cart_count = 0
    if request.session.session_key:
        cart = Cart.objects.filter(session_key=request.session.session_key).first()
        if cart:
            cart_count = cart.item_count  # Using the property
    
    return render(request, 'product_detail.html', {
        'product': product,
        'size_choices': size_choices,
        'cart_count': cart_count
    })


@csrf_exempt
def add_to_cart(request, product_id):
    if request.method == 'POST':
        try:
            product = Clothes.objects.get(id=product_id)
            size = request.POST.get('size')
            
            if not request.session.session_key:
                request.session.create()
            
            cart, created = Cart.objects.get_or_create(session_key=request.session.session_key)
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart, 
                product=product,
                size=size,
                defaults={'quantity': 1}
            )
            
            if not created:
                cart_item.quantity += 1
                cart_item.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Item added to cart',
                'cart_count': cart.item_count  # Using the property
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    }, status=405)

def remove_from_cart(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id)
    cart_item.delete()
    return redirect('cart_view')

def cart_view(request):
    if not request.session.session_key:
        request.session.create()
    
    cart = Cart.objects.filter(session_key=request.session.session_key).first()
    
    if cart:
        cart_items = cart.cartitem_set.select_related('product').all()
        total = sum(item.line_total for item in cart_items)  # Uses the line_total property
        item_count = cart.item_count
    else:
        cart_items = []
        total = 0
        item_count = 0
    
    return render(request, 'cart/cart.html', {
        'cart_items': cart_items,
        'total': total,
        'item_count': item_count
    })

import json
from .models import CartOrder

@csrf_exempt
@csrf_exempt
def confirm_cart_order(request):
    if request.method == 'POST':
        if not request.session.session_key:
            request.session.create()
        cart = Cart.objects.filter(session_key=request.session.session_key).first()

        if not cart or not cart.cartitem_set.exists():
            return redirect('cart_view')

        name = request.POST.get('name')
        phone = request.POST.get('phone')
        address = request.POST.get('address')

        # Save each cart item as an individual Order entry
        for item in cart.cartitem_set.select_related('product'):
            Order.objects.create(
                product=item.product,
                color='N/A',  # You could expand to add color if you track it in cart
                size=item.product.size,  # Or store size when adding to cart
                name=name,
                phone=phone,
                address=address,
                message=f"Cart order: {item.quantity} x {item.product.name}"
            )

        cart.cartitem_set.all().delete()

        return redirect('cart_order_confirmation')

    return HttpResponseForbidden("Invalid method")


def cart_order_confirmation(request):
    context = {'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    return render(request, 'orders/cart_order_confirmation.html', context)
