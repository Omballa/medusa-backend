import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import TelegramBot from "node-telegram-bot-api"

type TelegramOptions = {
  bot_token: string
  chat_id: string
}

export enum TelegramTemplate {
  ORDER_PLACED = "order-placed",
  CONTACT_US = "contact-us",
}

class TelegramNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-telegram"

  private bot: TelegramBot
  private options: TelegramOptions
  private logger: Logger

  constructor({ logger }: { logger: Logger }, options: TelegramOptions) {
    super()
    this.bot = new TelegramBot(options.bot_token, { polling: false })
    this.options = options
    this.logger = logger
  }

  static validateOptions(options: Record<any, any>) {
    if (!options.bot_token) throw new Error("`bot_token` is required for Telegram provider")
    if (!options.chat_id) throw new Error("`chat_id` is required for Telegram provider")
  }

  // ─────────────────────────────────────────────────────────────
  // Template Rendering
  // ─────────────────────────────────────────────────────────────
  private renderTemplate(template: TelegramTemplate, data: any): string {
    switch (template) {
      case TelegramTemplate.ORDER_PLACED:
        return this.renderOrderPlaced(data.order)

      case TelegramTemplate.CONTACT_US:
        return this.renderContactUs(data)

      default:
        return `New notification: ${template}`
    }
  }

  private renderOrderPlaced(order: any): string {
    return `New Order Placed!

*Order ID:* #${order.display_id || order.id}
*Customer:* ${order.customer?.first_name || ""} ${order.customer?.last_name || ""} <${order.email || "N/A"}>
*Total:* ${order.total ? (order.total / 100).toFixed(2) : "0.00"} ${order.currency_code?.toUpperCase()}
*Items:* ${order.items?.length || 0}
*Payment:* ${order.payments?.[0]?.provider_id || "unknown"} – ${order.payment_status}

*Shipping Address*
${order.shipping_address?.first_name} ${order.shipping_address?.last_name}
${order.shipping_address?.address_1}${order.shipping_address?.address_2 ? "\n" + order.shipping_address.address_2 : ""}
${order.shipping_address?.city}, ${order.shipping_address?.province || ""} ${order.shipping_address?.postal_code}
${order.shipping_address?.country_code?.toUpperCase()}

View in admin panel!`
  }

  private renderContactUs(data: any): string {
    const { name, email, phone, message, subject } = data

    return `New Contact Form Submission

*Name:* ${name || "Not provided"}
*Email:* ${email || "Not provided"}
${phone ? `*Phone:* ${phone}\n` : ""}*Subject:* ${subject || "No subject"}
*Message:*
${message || "No message"}

Reply to the customer as soon as possible!`
  }

  // ─────────────────────────────────────────────────────────────
  // Main send method
  // ─────────────────────────────────────────────────────────────
  async send(notification: any): Promise<any> {
    const { template, data } = notification

    const message = this.renderTemplate(template as TelegramTemplate, data)

    try {
      await this.bot.sendMessage(this.options.chat_id, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      })

      this.logger.info(`Telegram message sent – template: ${template}`)
      return { success: true }
    } catch (err: any) {
      this.logger.error(`Telegram send failed (${template}):`, err.message)
      throw err
    }
  }
}

export default TelegramNotificationProviderService