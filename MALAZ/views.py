from django.shortcuts import render
from .models import Clothes
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# Color mapping dictionary
COLOR_MAP = {
    '#000000': 'Black',
    '#D4AF37': 'Gold',
    '#005F6A': 'Teal',
    '#FF0000': 'Red',
    '#0000FF': 'Blue',
    '#FFFFFF': 'White'
    # Add more colors as needed
}

def convert_hex_to_color_name(hex_code):
    """Convert hex color code to nearest color name"""
    if not hex_code:
        return "Unknown"
    hex_code = hex_code.upper()
    return COLOR_MAP.get(hex_code, hex_code)  # fallback to hex if no name found


@csrf_exempt  # ✅ keep this for now because you’re posting via fetch
def make_order(request):
    if request.method == 'POST':
        try:
            product_id = request.POST.get('product_id')
            product = Clothes.objects.get(id=product_id)
            hex_color = request.POST.get('color')
            size = request.POST.get('size')
            phone = request.POST.get('phone')
            name = request.POST.get('name')
            address = request.POST.get('address')

            color_name = convert_hex_to_color_name(hex_color)

            message = (
                f"New Order Received!\n"
                f"Product: {product.name}\n"
                f"Color: {color_name}\n"
                f"Size: {size}\n"
                f"Customer Details:\n"
                f"- Name: {name}\n"
                f"- Phone: {phone}\n"
                f"- Address: {address}"
            )

            print(message)  # Replace with real saving or email in production

            return JsonResponse({'status': 'success', 'message': 'Order received!'})

        except Exception as e:
            print("Error:", e)
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


def home(request):
    clothes = Clothes.objects.all()
    size_choices = Clothes._meta.get_field('size').choices

    return render(request, 'home.html', {
        'clothes': clothes,
        'size_choices': size_choices,
    })
