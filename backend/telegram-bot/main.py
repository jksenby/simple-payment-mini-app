from telegram.ext import Application, MessageHandler, filters, CommandHandler
from dotenv import load_dotenv
import os

load_dotenv()

async def reply(update, context):
  await update.message.reply_text("Hello there!")

async def reply_to_photo(update, context):
  await update.message.reply_text("No Vibe!")

def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    application = Application.builder().token(token).concurrent_updates(True).read_timeout(30).write_timeout(30).build()
    application.add_handler(CommandHandler("startapp", reply))
    application.add_handler(MessageHandler(filters.PHOTO, reply_to_photo))
    print("Telegram Bot started!", flush=True)
    application.run_polling()


if __name__ == '__main__':
    main()
