import threading
import os
import html
from dotenv import load_dotenv
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import payment

# --- FastAPI setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "https://simple-payment-mini-app.vercel.app",
        "https://simple-payment-mini-app-54db.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payment.router, prefix="/api/payments", tags=["Payments"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# --- Telegram Bot setup ---
def run_bot():
    import asyncio
    from telegram import Update, MenuButtonWebApp, WebAppInfo, LabeledPrice
    from telegram.constants import ParseMode
    from telegram.ext import (
        Application,
        CommandHandler,
        MessageHandler,
        ContextTypes,
        PreCheckoutQueryHandler,
        filters,
    )
    import html
    from dotenv import load_dotenv

    load_dotenv()

    token = os.getenv("TELEGRAM_BOT_TOKEN")
    provider_token = os.getenv("TELEGRAM_PROVIDER_TOKEN")

    async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text("Hello there!")

    async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
        text = update.message.text if update.message else ""
        user = update.effective_user
        username = user.username if user.username else (user.first_name or "there")
        reply_html = f"<b>{html.escape(username)}, please repeat:</b>\n<code>{html.escape(text)}</code>"
        await update.message.reply_text(reply_html, parse_mode=ParseMode.HTML)

    async def reply_to_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text("No Vibe!")

    async def buy(update: Update, context: ContextTypes.DEFAULT_TYPE):
        if not provider_token:
            await update.message.reply_text("Payment provider token not configured.")
            print("Missing TELEGRAM_PROVIDER_TOKEN env var.", flush=True)
            return

        title = "Buy Nothing"
        description = "Sample purchase of nothing"
        payload = "nothing-purchase-001"
        currency = "KZT"
        prices = [LabeledPrice(label="Item", amount=300000)]

        await context.bot.send_invoice(
            chat_id=update.effective_chat.id,
            title=title,
            description=description,
            payload=payload,
            provider_token=provider_token,
            currency=currency,
            prices=prices,
            need_name=False,
            need_email=False,
            is_flexible=False,
        )
        print("Invoice sent.", flush=True)

    async def precheckout_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.pre_checkout_query
        try:
            await query.answer(ok=True)
            print("Pre-checkout approved.", flush=True)
        except Exception as e:
            print(f"Pre-checkout error: {e}", flush=True)

    async def successful_payment(update: Update, context: ContextTypes.DEFAULT_TYPE):
        payment = update.message.successful_payment
        print(f"Payment successful: {payment.to_dict()}", flush=True)
        await update.message.reply_text("✅ Payment received. Thank you!")

    async def post_init(application: Application):
        await application.bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(
                text="Launch",
                web_app=WebAppInfo(url="https://simple-payment-mini-app.vercel.app"),
            )
        )

    async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
        print(f"Exception while handling update: {context.error}", flush=True)

    application = (
        Application.builder()
        .token(token)
        .post_init(post_init)
        .concurrent_updates(True)
        .read_timeout(30)
        .write_timeout(30)
        .build()
    )

    application.add_handler(CommandHandler("startapp", start))
    application.add_handler(CommandHandler("buy", buy))
    application.add_handler(MessageHandler(filters.PHOTO, reply_to_photo))
    application.add_handler(MessageHandler(filters.TEXT, echo))
    application.add_handler(PreCheckoutQueryHandler(precheckout_callback))
    application.add_handler(MessageHandler(filters.SUCCESSFUL_PAYMENT, successful_payment))
    application.add_error_handler(error_handler)

    print("Telegram Bot started!", flush=True)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(application.run_polling(stop_signals=None))



if __name__ == "__main__":
    # Run Telegram bot
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    bot_thread.start()

    # Run FastAPI
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting FastAPI on port {port}...", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=port)
