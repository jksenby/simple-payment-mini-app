from operator import truediv

from telegram import Update, MenuButtonWebApp, WebAppInfo, LabeledPrice
from telegram.constants import ParseMode
from telegram.ext import Application, MessageHandler, filters, CommandHandler, ContextTypes, PreCheckoutQueryHandler
from dotenv import load_dotenv
import os
import html

load_dotenv()

token = os.getenv("TELEGRAM_BOT_TOKEN")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
  await update.message.reply_text("Hello there!")

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
  text = update.message.text if update.message else ""
  user = update.effective_user
  username = user.username if user and user.username else (user.first_name if user else "there")
  # Telegram doesn't support bold + monospace in the same span. Use bold label + code block.
  reply_html = f"<b>{html.escape(username)}, please, repeat yourself:</b>\n<code>{html.escape(text)}</code>"
  await update.message.reply_text(reply_html, parse_mode=ParseMode.HTML)

async def reply_to_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
  await update.message.reply_text("No Vibe!")

async def set_menu_button(application: Application):
  await application.bot.set_chat_menu_button(
    menu_button=MenuButtonWebApp(text="Launch", web_app=WebAppInfo(url="https://simple-payment-mini-app-54db.vercel.app"))
  )

async def buy(update: Update, context: ContextTypes.DEFAULT_TYPE):
  provider_token = os.getenv("TELEGRAM_PROVIDER_TOKEN")
  if not provider_token:
    await update.message.reply_text("Payment provider token is not set on the server.")
    print("Missing TELEGRAM_PROVIDER_TOKEN env var.", flush=True)
    return
  title = "Buy Nothing"
  description = "Sample of nothing via Telegram Payments"
  payload = "nothing-purchase-payload-001"
  currency = "KZT"
  prices = [
    LabeledPrice(label="Item", amount=300000)
  ]
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
    is_flexible=False
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
  await set_menu_button(application)

async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
  print(f"Exception while handling update: {context.error}", flush=True)

def main():
    application = Application.builder().token(token).post_init(post_init).concurrent_updates(True).read_timeout(30).write_timeout(30).build()
    application.add_handler(CommandHandler("startapp", start))
    application.add_handler(CommandHandler("buy", buy))
    application.add_handler(MessageHandler(filters.PHOTO, reply_to_photo))
    application.add_handler(MessageHandler(filters.TEXT, echo))
    application.add_handler(PreCheckoutQueryHandler(precheckout_callback))
    application.add_handler(MessageHandler(filters.SUCCESSFUL_PAYMENT, successful_payment))
    application.add_error_handler(error_handler)
    print("Telegram Bot started!", flush=True)
    application.run_polling()


if __name__ == '__main__':
    main()
