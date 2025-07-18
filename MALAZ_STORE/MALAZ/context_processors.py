from .models import Cart

def cart_contents(request):
    if not request.session.session_key:
        request.session.create()
    session_key = request.session.session_key
    
    cart, created = Cart.objects.get_or_create(session_key=session_key)
    cart_items = cart.cartitem_set.select_related('product').all()
    total = sum(item.product.price * item.quantity for item in cart_items)
    item_count = sum(item.quantity for item in cart_items)  # Total quantity of all items
    
    return {
        'cart_items': cart_items,
        'cart_total': total,
        'cart_count': item_count  # This now shows total quantity, not just item types
    }