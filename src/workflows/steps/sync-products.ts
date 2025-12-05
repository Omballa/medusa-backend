import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MEILISEARCH_MODULE } from "../../modules/meilisearch"
import MeilisearchModuleService from "../../modules/meilisearch/service"

export type SyncProductsStepInput = {
  products: {
    id: string
    title: string
    description?: string
    handle: string
    thumbnail?: string
    categories: {
      id: string
      name: string
      handle: string
    }[]
    tags: {
      id: string
      value: string
    }[]
  }[]
}

export const syncProductsStep = createStep(
  "sync-products",
  async ({ products }: SyncProductsStepInput, { container }) => {
    const meilisearchModuleService = container.resolve<MeilisearchModuleService>(
      MEILISEARCH_MODULE
    )

    try {
        const plainDocuments = products.map((p) => ({
            id: p.id,
            title: p.title ?? "",
            description: p.description ?? "",
            handle: p.handle,
            thumbnail: p.thumbnail ?? null,
            category_ids: p.categories.map((c) => c.id),
            category_names: p.categories.map((c) => c.name),
            category_handles: p.categories.map((c) => c.handle),
            tags: p.tags.map((t) => t.value),
        }))

        console.log(`Indexing ${plainDocuments.length} products into MeiliSearch...`)
        
        const existingProducts = await meilisearchModuleService.retrieveFromIndex(
            plainDocuments.map((d) => d.id),
            "product"
        )

        const existingIds = new Set(existingProducts.map((e: any) => e.id))
        const newProducts = plainDocuments.filter((d) => !existingIds.has(d.id))

        
        await meilisearchModuleService.indexData(
            plainDocuments as unknown as Record<string, unknown>[], 
            "product"
        )

        console.log(`Indexed ${plainDocuments.length} products (${newProducts.length} new)`)

        return new StepResponse(undefined, {
            newProducts: newProducts.map((product) => product.id),
            existingProducts,
        })
    }
    catch (error) {
        console.error("syncProductsStep FAILED:", error)
        console.error("First product sample:", products[0])
        throw error // re-throw so the workflow fails loudly
    }
    
    
  },

  async (input, { container }) => {
    if (!input) {
      return
    }

    const meilisearchModuleService = container.resolve<MeilisearchModuleService>(
      MEILISEARCH_MODULE
    )
    
    if (input.newProducts) {
      await meilisearchModuleService.deleteFromIndex(
        input.newProducts,
        "product"
      )
    }

    if (input.existingProducts) {
      await meilisearchModuleService.indexData(
        input.existingProducts,
        "product"
      )
    }
  }
  
)