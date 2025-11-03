from fastapi import APIRouter

from app.core.models import Payment

router = APIRouter()

@router.post("/create-checkout-session")
def create_checkout_session(payment: Payment):
    return {"message": "Payment created successfully"}

@router.get("/methods")
def get_payment_methods():
    return {"methods": ["telegram", "visa", "mastercard"]}