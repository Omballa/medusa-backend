// src/subscribers/order-telegram-notification.ts
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

async function sendTelegramMessage(message: string): Promise<void> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    }),
  })

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.statusText}`)
  }
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")

  try {
    // Fetch order details using Query
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "total",
        "currency_code",
        "items.*",
        "shipping_address.*",
      ],
      filters: { id: data.id },
    })

    const order = orders[0]
    if (!order) {
      logger.warn(`Order ${data.id} not found`)
      return
    }

    // Build the Telegram message
    const itemsList = order.items
      ?.map((item: any) => `  • ${item.title} x${item.quantity}`)
      .join("\n") || "No items"

    const message = `
🛒 <b>New Order Received!</b>

<b>Order #${order.id}</b>
<b>Customer Email:</b> ${order.email}
<b>Total:</b> ${order.currency_code?.toUpperCase()}: ${order.total}

<b>Items:</b>
${itemsList}

<b>Shipping to:</b>
${order.shipping_address?.first_name || ""} ${order.shipping_address?.last_name || ""}
${order.shipping_address?.address_1 || ""}
${order.shipping_address?.city || ""}, ${order.shipping_address?.postal_code || ""}
${order.shipping_address?.country_code?.toUpperCase() || ""}
`.trim()

    await sendTelegramMessage(message)
    logger.info(`Telegram notification sent for order ${order.id}`)

  } catch (error) {
    logger.error(`Failed to send Telegram notification: ${error}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}