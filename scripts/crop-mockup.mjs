import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const src = 'public/images/mockup-full.png'
const meta = await sharp(src).metadata()
const W = meta.width
const H = meta.height

await mkdir('public/images', { recursive: true })

// Bottom "So What" illustration column (Hai + speech + shelf)
await sharp(src)
  .extract({
    left: Math.round(W * 0.38),
    top: Math.round(H * 0.52),
    width: Math.round(W * 0.6),
    height: Math.round(H * 0.46),
  })
  .toFile('public/images/hai-so-what.png')

// Hero wordmark area reference (optional)
await sharp(src)
  .extract({
    left: Math.round(W * 0.03),
    top: Math.round(H * 0.2),
    width: Math.round(W * 0.42),
    height: Math.round(H * 0.28),
  })
  .toFile('public/images/hero-card-reference.png')

console.log('Cropped', W, H)
