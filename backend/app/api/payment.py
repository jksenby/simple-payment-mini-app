import os
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
import stripe
from app.core.models import Payment

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()

@router.post("/create-checkout-session")
def create_checkout_session(payment: Payment, request: Request):
    try:
        origin = request.headers.get("origin")

        if not origin:
            origin = "https://simple-payment-mini-app.vercel.app"

        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price': 'price_1SPND8P8BlWshfIDFLdVVfRJ',
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=origin + '/success',
            cancel_url=origin + '/cancel',
        )
        
        return {"url": checkout_session.url}
    except Exception as e:
        return str(e)

@router.get("/methods")
def get_payment_methods():
    return {"methods": ["telegram", "visa", "mastercard"]}