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

    // Your Telegram bot credentials
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Telegram credentials not configured");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    // Format the message for Telegram
    const telegramMessage = `
🔔 *New Contact Form Submission*

👤 *Name:* ${name}
📧 *Email:* ${email}
${phone ? `📱 *Phone:* ${phone}` : ""}

💬 *Message:*
${message}
    `.trim();

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: "Markdown",
      }),
    });

    const telegramData = await response.json();

    if (!response.ok) {
      console.error("Telegram API error:", telegramData);
      return res.status(500).json({
        success: false,
        error: "Failed to send notification",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}