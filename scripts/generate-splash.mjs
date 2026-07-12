// Generates iOS launch screens (apple-touch-startup-image) so the installed
// PWA shows a branded splash instead of a blank white flash on cold start.
// One PNG per device resolution + a matching <link> media query; prints the
// tag block to paste into index.html. Dependency-free raw-PNG writer (same
// technique as generate-icons.mjs), drawing the centered dumbbell mark.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const BG = [9, 9, 11, 255] // #09090b — matches theme-color + HTML splash
const MARK = [52, 211, 153, 255] // #34d399 mint

// dumbbell in normalized 0..1 coords (handle + 4 plates), symmetric
const BARS = [
  [0.30, 0.70, 0.455, 0.545],
  [0.235, 0.315, 0.35, 0.65],
  [0.685, 0.765, 0.35, 0.65],
  [0.16, 0.235, 0.40, 0.60],
  [0.765, 0.84, 0.40, 0.60],
]
const inMark = (nx, ny) => BARS.some(([x0, x1, y0, y1]) => nx >= x0 && nx <= x1 && ny >= y0 && ny <= y1)

// iPhone portrait devices: [cssW, cssH, ratio]  (points, not pixels)
const DEVICES = [
  [440, 956, 3], // 16 Pro Max
  [402, 874, 3], // 16 Pro
  [430, 932, 3], // 15/16 Plus, 14/15 Pro Max
  [393, 852, 3], // 14/15/16, 15/16 Pro
  [428, 926, 3], // 12/13/14 Pro Max
  [390, 844, 3], // 12/13/14, Pro
  [375, 812, 3], // X / XS / 11 Pro
  [414, 896, 3], // XS Max / 11 Pro Max
  [414, 896, 2], // XR / 11
  [375, 667, 2], // SE 2/3 / 8
  [320, 568, 2], // SE 1
]

function crc32(buf) {
  const t = (crc32.t ||= (() => {
    const a = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      a[n] = c >>> 0
    }
    return a
  })())
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = t[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const tb = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([tb, data])), 0)
  return Buffer.concat([len, tb, data, crc])
}

function makePng(w, h) {
  const px = new Uint8Array(w * h * 4)
  // mark spans ~46% of the shorter side, centered
  const side = Math.min(w, h) * 0.46
  const ox = (w - side) / 2
  const oy = (h - side) / 2
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = (x - ox) / side
      const ny = (y - oy) / side
      const color = nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1 && inMark(nx, ny) ? MARK : BG
      const i = (y * w + x) * 4
      px[i] = color[0]
      px[i + 1] = color[1]
      px[i + 2] = color[2]
      px[i + 3] = color[3]
    }
  }
  const raw = Buffer.alloc(h * (w * 4 + 1))
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0
    Buffer.from(px.buffer, y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync('public/splash', { recursive: true })
const tags = []
const seen = new Set()
for (const [cw, ch, r] of DEVICES) {
  const pw = cw * r
  const ph = ch * r
  const file = `apple-splash-${pw}x${ph}.png`
  if (!seen.has(file)) {
    writeFileSync(`public/splash/${file}`, makePng(pw, ph))
    seen.add(file)
    console.log('wrote', file)
  }
  tags.push(
    `    <link rel="apple-touch-startup-image" media="screen and (device-width: ${cw}px) and (device-height: ${ch}px) and (-webkit-device-pixel-ratio: ${r}) and (orientation: portrait)" href="/splash/${file}" />`
  )
}
writeFileSync('scripts/splash-tags.html', tags.join('\n') + '\n')
console.log('\nLink tags written to scripts/splash-tags.html')
