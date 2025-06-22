from operator import truediv

from telegram.ext import Application, MessageHandler, filters, CommandHandler
from dotenv import load_dotenv
import os

load_dotenv()

async def reply(update, context):
  await update.message.reply_text("Hello there!")
  print("1")

async def reply_to_photo(update, context):
  await update.message.reply_text("No Vibe!")

async def set_menu_button(application):
  await application.bot.set_chat_menu_button(
    menu_button={"type": "web_app", "text": "Launch", "web_app": {"url": "https://simple-payment-mini-app-54db.vercel.app"}}
  )

async def post_init(application):
  """This runs after the application is initialized but before polling starts"""
  await set_menu_button(application)

def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    application = Application.builder().token(token).post_init(post_init).concurrent_updates(True).read_timeout(30).write_timeout(30).build()
    application.add_handler(CommandHandler("startapp", reply))
    application.add_handler(MessageHandler(filters.PHOTO, reply_to_photo))
    print("Telegram Bot started!", flush=True)
    application.run_polling()


if __name__ == '__main__':
    main()
