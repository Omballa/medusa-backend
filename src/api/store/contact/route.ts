export async function POST(req, res) {
  try {
    console.log("Request body:", req.body);
    const { name, email, message, phone } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required",
      });
    }

    // Resolve Medusa's notification service from the request scope
    const notificationService = req.scope.resolve("notificationService")

    // Send the notification using your existing Telegram provider + template
    await notificationService.sendNotification({
      template: "contact-us",
      channel: "messaging",           // matches what you set in medusa-config.ts
      to: "telegram",                 // dummy value — required by Medusa, ignored by our provider
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim(),
        message: message.trim(),
      },
    })

    // Optional: also send an email to yourself via Resend (uncomment when ready)
    // await notificationService.sendNotification({
    //   template: "contact-us-admin",
    //   channel: "email",
    //   to: "admin@yourstore.com",
    //   data: { name, email, phone, subject, message },
    // })

    return res.json({
      success: true,
      message: "Thank you! Your message has been sent.",
    })

    
  } catch (error) {
    console.error("Error processing contact form:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}