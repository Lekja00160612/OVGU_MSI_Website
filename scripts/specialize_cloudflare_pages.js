import { rmSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Cloudflare Pages Static Specialization Script
 * 
 * Ensures the project is deployed as 100% Pure Static Site Generation (SSG)
 * on Cloudflare Pages without invoking Cloudflare Workers or Edge Functions.
 * 
 * 1. Removes dist/_worker.js so Cloudflare Pages deploys as pure static assets.
 * 2. Removes dist/_routes.json to prevent Cloudflare from routing any HTML requests to a worker.
 * 3. Guarantees dist/404.html exists for Cloudflare Pages edge fallback routing.
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

  const fallback404 = join(distDir, '404.html')
  if (!existsSync(fallback404)) {
    const html404 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Not Found (404) | VGU &amp; OVGU MSI</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #F8FAFC; color: #0F172A; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
    .card { background: #FFFFFF; border-radius: 24px; padding: 40px; max-width: 440px; margin: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0; }
    .icon { width: 56px; height: 56px; margin: 0 auto 20px; border-radius: 16px; background-color: #FFF7ED; display: flex; align-items: center; justify-content: center; color: #E87722; font-size: 28px; }
    h1 { font-size: 42px; font-weight: 900; color: #1E3A5F; margin: 0 0 8px; }
    h2 { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 12px; }
    p { font-size: 14px; color: #64748B; margin: 0 0 28px; line-height: 1.5; }
    .btn { display: inline-block; background-color: #E87722; color: #FFFFFF; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 12px; text-decoration: none; transition: background-color 150ms; }
    .btn:hover { background-color: #C95E0A; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">&#9888;</div>
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for does not exist or has been moved to a new address.</p>
    <a href="/" class="btn">Return to Homepage</a>
  </div>
</body>
</html>`
    writeFileSync(fallback404, html404, 'utf-8')
    console.log('✓ [Cloudflare Pages Static] Generated fallback dist/404.html')
  }

  console.log('✨ [Cloudflare Pages Static] Build successfully specialized for pure Static Site Rendering!')
} else {
  console.warn('⚠️ [Cloudflare Pages Static] dist directory not found.')
}
