import fetch from "node-fetch"

class TelegramService {
  constructor({}, options) {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN
    this.chatId = process.env.TELEGRAM_CHAT_ID
  }

  async sendMessage(message) {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: this.chatId,
        text: message,
      }),
    })
  }
}

export default TelegramService
