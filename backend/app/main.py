from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import payment
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for Angular dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "https://simple-payment-mini-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(payment.router, prefix="/api/payments", tags=["Payments"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
    
# uvicorn app.main:app --host 0.0.0.0 --port 8000