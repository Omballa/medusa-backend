<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce with contact form, telegram notification, meilisearch and resend integration for order confirmation.
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 2 of `@medusajs/medusa`. 

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.

Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.

### Setting up Meilisearch

To enable search functionality in the storefront, you need a running Meilisearch instance.

Follow the official Meilisearch documentation for installation and setup:  
[Meilisearch Installation Guide](https://www.meilisearch.com/docs/learn/getting_started/installation)

Common ways to run Meilisearch:
- Locally via binary or Homebrew
- Using Docker: `docker run -it --rm -p 7700:7700 getmeili/meilisearch:latest`

For production, set a master key (via `--master-key` or `MEILI_MASTER_KEY` env) to enable security. Meilisearch will then generate a **Default Search API Key** (safe for client-side use).

Once Meilisearch is running (default endpoint: `http://localhost:7700`):

1. Create your index (e.g., `products`) if not already done by the backend.
2. Copy the following into your backend's `.env` file:

```shell
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your_default_admin_api_key_here
MEILISEARCH_PRODUCT_INDEX_NAME=products

### Setting up Telegram Bot and Resend for Notifications

To enable Telegram notifications and email sending (via Resend) in the backend, configure the following credentials.

#### 1. Telegram Bot Setup
- Create a bot via [@BotFather](https://t.me/BotFather) on Telegram: Send `/newbot`, follow instructions, and receive your **bot token**.
- Official Telegram Bot API docs: [core.telegram.org/bots](https://core.telegram.org/bots)

#### 2. Getting Telegram Chat ID
- For personal notifications: Start a chat with your bot (send any message).
- For group/channel: Add the bot to the group/channel and send a message.
- Retrieve the chat ID by visiting: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`  
  Look for `"chat":{"id":XXXXXX}` in the JSON response (group IDs are negative).

#### 3. Resend Setup
- Sign up at [resend.com](https://resend.com) and get your **API key** from the dashboard.
- Set a verified sender email as your `from` address.
- Official Resend documentation: [resend.com/docs](https://resend.com/docs/api-reference/introduction)

Add these values to your backend's `.env` file (or equivalent):

```properties
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
RESEND_FROM_EMAIL=verified@example.com
RESEND_API_KEY=re_your_api_key_here
```

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)
