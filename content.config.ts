import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),
    activities: defineCollection({
      type: 'page',
      source: '_activities/*.md',
      schema: z.object({
        title: z.string(),
        category: z.string().default('Other Activities'),
        image: z.string(),
        date: z.string(),
        description: z.string().optional()
      })
    }),
    modules: defineCollection({
      type: 'page',
      source: '_modules/*.md',
      schema: z.object({
        title: z.string(),
        semester: z.number().default(1),
        german_lecturer: z.boolean().default(false),
        is_elective: z.boolean().default(false),
        description: z.string().optional()
      })
    })
  }
})
