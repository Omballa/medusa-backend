// src/workflows/send-contact-notification.ts
import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { sendNotificationsStep } from "@medusajs/medusa/core-flows"

type ContactInput = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export const sendContactNotificationWorkflow = createWorkflow(
  "send-contact-notification",
  function (input: ContactInput) {
    const { name, email, phone, subject, message } = input

    // This step sends the notification(s) — it gets "called" automatically
    sendNotificationsStep([{
      // Telegram notification (your custom provider handles it)
      to: "telegram",  // dummy value, required by types
      channel: "messaging",
      template: "contact-us",
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim(),
        subject: subject?.trim(),
        message: message.trim(),
      },
    }])

    // Optional: Add more notifications (e.g., admin email via Resend)
    // sendNotificationsStep({
    //   to: "admin@yourstore.com",
    //   channel: "email",
    //   template: "contact-us-admin",
    //   data: { name, email, phone, subject, message },
    // })
  }
)