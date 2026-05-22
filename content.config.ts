import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Dynamic extraction of lecturers from partners-lecturers.md
const getLecturerNames = (): [string, ...string[]] => {
  const fallback: [string, ...string[]] = [
    'Dr. Nguyen Xuan Thanh',
    'Dr. rer. nat. Sven Henning',
    'Prof. Dr. rer. nat. Jürgen Christen',
    'apl. Prof. Dr. rer. nat. habil. Frank Bertram',
    'Prof. Dr.-Ing. Daniel Juhre'
  ]
  try {
    const filePath = join(process.cwd(), 'content/partners-lecturers.md')
    const content = readFileSync(filePath, 'utf-8')
    const matches = content.match(/name:\s*"([^"]+)"/g)
    if (matches) {
      const names = matches.map(m => m.replace(/name:\s*"/, '').replace(/"$/, '').trim())
      const uniqueNames = Array.from(new Set(names))
      if (uniqueNames.length > 0) {
        return uniqueNames as [string, ...string[]]
      }
    }
  } catch (e) {
    // Silent catch
  }
  return fallback
}

const lecturerNames = getLecturerNames()

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),
    research: defineCollection({
      type: 'page',
      source: '_research/*.md',
      schema: z.object({
        id: z.string(),
        title: z.string(),
        title_vi: z.string().optional(),
        head: z.string(),
        head_avatar: z.string(),
        cover_image: z.string(),
        link_to_introduction: z.string().optional(),
        topics: z.array(z.string()).default([]),
        topics_vi: z.array(z.string()).optional(),
        projects: z.string().optional(),
        projects_vi: z.string().optional()
      })
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
        description: z.string().optional(),
        lecturers: z.array(z.enum(lecturerNames)).default([]),
        images: z.array(z.string()).optional(),
        pdfs: z.array(
          z.object({
            title: z.string(),
            url: z.string()
          })
        ).optional(),
        links: z.array(
          z.object({
            title: z.string(),
            url: z.string(),
            description: z.string().optional()
          })
        ).optional()
      })
    }),
    equipments: defineCollection({
      type: 'page',
      source: '_equipments/*.md',
      schema: z.object({
        id: z.string(),
        name: z.string(),
        room: z.string(),
        category: z.string(),
        description: z.string().optional(),
        images: z.array(z.string()).default([]),
        pdfs: z.array(
          z.object({
            title: z.string(),
            url: z.string()
          })
        ).optional(),
        links: z.array(
          z.object({
            title: z.string(),
            url: z.string(),
            description: z.string().optional()
          })
        ).optional()
      })
    })
  }
})
