'''
from twilio.rest import Client
from django.conf import settings

# Function to send a WhatsApp message
def send_whatsapp_message(order_details):
    # Twilio credentials from your Twilio account
    account_sid = settings.TWILIO_SID
    auth_token = settings.TWILIO_AUTH_TOKEN
    from_whatsapp_number = 'whatsapp:+14155238886'
    to_whatsapp_number = 'whatsapp:+201009677284'    # Owner's WhatsApp number (in international format)

    # Create Twilio client
    client = Client(account_sid, auth_token)

    # Message to be sent
    message = f"{order_details}"

    # Send the message via WhatsApp
    message = client.messages.create(
        body=message,
        from_=from_whatsapp_number,
        to=to_whatsapp_number
    )

    return message.sid  # You can return the SID to track the message status if necessary

'''