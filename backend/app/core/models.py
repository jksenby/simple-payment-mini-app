from pydantic import BaseModel

class Payment(BaseModel):
    username: str
    fullName: str
    cardNumber: str
    cardExpiration: str
    cvv: str
    amount: float