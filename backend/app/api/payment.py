import os
from fastapi import APIRouter, Request
import stripe
from app.core.models import Payment, SubscriptionRequest
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()

@router.get("/create-checkout-session")
def create_checkout_session(request: Request):
    try:
        origin = request.headers.get("origin")

        if not origin:
            origin = "https://simple-payment-mini-app.vercel.app"

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[{
                "price_data": {
                    "currency": "KZT",
                    "product_data": {"name": "Nothing"},
                    "unit_amount": 30000,
                },
                "quantity": 1,
            }],
            success_url=origin + '/success',
            cancel_url=origin + '/cancel',
        )
        
        return {"url": checkout_session.url}
    except Exception as e:
        return str(e)

@router.post("/create-subscription")
async def create_subscription(data: SubscriptionRequest, request: Request):
    try:
        origin = request.headers.get("origin") or "https://simple-payment-mini-app.vercel.app"

        customers = stripe.Customer.list(email=data.email).data
        customer = customers[0] if customers else stripe.Customer.create(email=data.email)

        checkout_session = stripe.checkout.Session.create(
            customer=customer.id,
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": data.price_id, "quantity": 1}],
            success_url=origin + "/success",
            cancel_url=origin + "/cancel",
        )

        return {"url": checkout_session.url}

    except Exception as e:
        return {"error": str(e)}

@router.get("/methods")
def get_payment_methods():
    return {"methods": ["telegram", "visa", "mastercard"]}