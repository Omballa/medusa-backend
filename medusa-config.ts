import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import type { MeilisearchPluginOptions } from '@rokmohar/medusa-plugin-meilisearch'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    databaseDriverOptions: {
      ssl: false,
      sslmode: "disable",
    },
    workerMode: process.env.MEDUSA_WORKER_MODE as | "shared" | "worker" | "server",
    redisUrl: process.env.REDIS_URL,
  },

  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },


  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              }
            },
          },
        ],      
      },
    },
    {
      resolve: "@medusajs/medusa/notification",  // ← Core notification module (REQUIRED for custom providers)
      options: {
        providers: [  // ← Your custom Resend goes HERE, as a sub-provider
          {
            resolve: "./src/modules/resend",  // ← Path to your module
            id: "resend",  // ← Matches what your subscriber calls
            options: {
              channels: ["email"],  // ← Enables email channel
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL,
            },
          },
          {
            resolve: "./src/modules/telegram",  // ← Path to your module
            id: "telegram",  // ← Matches what your subscriber calls
            options: {
              channels: ["messaging"],  // ← Enables messaging channel
              bot_token: process.env.TELEGRAM_BOT_TOKEN,
              chat_id: process.env.TELEGRAM_CHAT_ID,
            },
          },
        ],
      },
    },
  ],

  plugins: [
    // ... other plugins
    {
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: process.env.MEILISEARCH_HOST ?? '',
          apiKey: process.env.MEILISEARCH_API_KEY ?? '',
        },
        settings: {
          // The key is used as the index name in Meilisearch
          products: {
            // Required: Index type
            type: 'products',
            // Optional: Whether the index is enabled. When disabled:
            // - Index won't be created or updated
            // - Documents won't be added or removed
            // - Index won't be included in searches
            // - All operations will be silently skipped
            enabled: true,
            // Optional: Specify which fields to include in the index
            // If not specified, all fields will be included
            fields: ['id', 'title', 'description', 'handle', 'variant_sku', 'thumbnail'],
            indexSettings: {
              searchableAttributes: ['title', 'description', 'variant_sku'],
              displayedAttributes: ['id', 'handle', 'title', 'description', 'variant_sku', 'thumbnail'],
              filterableAttributes: ['id', 'handle'],
            },
            primaryKey: 'id',
            // Create your own transformer
            /*transformer: (product) => ({
              id: product.id,
              // other attributes...
            }),*/
          },
          // categories: {
          //   // Required: Index type
          //   type: 'categories',
          //   // Optional: Whether the index is enabled
          //   enabled: true,
          //   // Optional: Specify which fields to include in the index
          //   // If not specified, all fields will be included
          //   fields: ['id', 'name', 'description', 'handle', 'is_active', 'parent_id'],
          //   indexSettings: {
          //     searchableAttributes: ['name', 'description'],
          //     displayedAttributes: ['id', 'name', 'description', 'handle', 'is_active', 'parent_id'],
          //     filterableAttributes: ['id', 'handle', 'is_active', 'parent_id'],
          //   },
          //   primaryKey: 'id',
          //   // Create your own transformer
          //   /*transformer: (category) => ({
          //     id: category.id,
          //     name: category.name,
          //     // other attributes...
          //   }),*/
          // },
        },
        i18n: {
          // Choose one of the following strategies:

          // 1. Separate index per language
          // strategy: 'separate-index',
          // languages: ['en', 'fr', 'de'],
          // defaultLanguage: 'en',

          // 2. Language-specific fields with suffix
          strategy: 'field-suffix',
          languages: ['en'],
          defaultLanguage: 'en',
          translatableFields: ['title', 'description'],
        },
      } satisfies MeilisearchPluginOptions,
    },
  ],
})
