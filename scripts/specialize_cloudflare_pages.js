import { rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Cloudflare Pages Static Specialization Script
 * 
 * Ensures the project is deployed as 100% Pure Static Site Generation (SSG)
 * on Cloudflare Pages without invoking Cloudflare Workers or Edge Functions.
 * 
 * 1. Removes dist/_worker.js so Cloudflare Pages deploys as static assets only.
 * 2. Removes dist/_routes.json to prevent Cloudflare from routing any HTML requests to a worker.
 */

const distDir = join(process.cwd(), 'dist')

if (existsSync(distDir)) {
  const workerPath = join(distDir, '_worker.js')
  if (existsSync(workerPath)) {
    rmSync(workerPath, { recursive: true, force: true })
    console.log('✓ [Cloudflare Pages Static] Removed dist/_worker.js (Disabled Cloudflare Worker invocation)')
  }

  const routesPath = join(distDir, '_routes.json')
  if (existsSync(routesPath)) {
    rmSync(routesPath, { force: true })
    console.log('✓ [Cloudflare Pages Static] Removed dist/_routes.json (100% CDN Edge Static Serving)')
  }

  console.log('✨ [Cloudflare Pages Static] Build successfully specialized for pure Static Site Rendering!')
} else {
  console.warn('⚠️ [Cloudflare Pages Static] dist directory not found.')
}
