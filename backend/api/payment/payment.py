from fastapi import APIRouter

router = APIRouter()

@router.get("/methods")
def get_payment_methods():
    return {"methods": ["telegram", "visa", "mastercard"]}