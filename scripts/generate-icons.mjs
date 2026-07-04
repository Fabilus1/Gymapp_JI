// Generates simple monogram PNG icons for the PWA manifest without any
// image/canvas dependency — just raw PNG chunk writing + zlib deflate.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const BG = [9, 9, 11, 255] // zinc-950 background
const ACCENT = [52, 211, 153, 255] // #34D399 emerald accent

function crc32(buf) {
  let c
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
      c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      t[n] = c >>> 0
    }
    return t
  })())
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

// Dumbbell mark (matches the in-app splash), drawn in normalized coords and
// scaled to `size`. `scale` shrinks the mark for maskable safe zones.
// A pixel is "on" if it falls inside the handle bar or any of the 4 plates.
const BARS = [
  // [x0, x1, y0, y1] in 0..1, symmetric around center
  [0.30, 0.70, 0.455, 0.545], // handle
  [0.235, 0.315, 0.35, 0.65], // inner plate (left)
  [0.685, 0.765, 0.35, 0.65], // inner plate (right)
  [0.16, 0.235, 0.40, 0.60], // outer plate (left)
  [0.765, 0.84, 0.40, 0.60], // outer plate (right)
]

function insideDumbbell(nx, ny) {
  for (const [x0, x1, y0, y1] of BARS) {
    if (nx >= x0 && nx <= x1 && ny >= y0 && ny <= y1) return true
  }
  return false
}

function makePng(size, { scale = 1 }) {
  const px = new Uint8Array(size * size * 4)
  const center = 0.5
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // normalize to 0..1, then map through the scale around the center
      const nx = center + (((x + 0.5) / size) - center) / scale
      const ny = center + (((y + 0.5) / size) - center) / scale
      const color = insideDumbbell(nx, ny) ? ACCENT : BG
      const i = (y * size + x) * 4
      px[i] = color[0]
      px[i + 1] = color[1]
      px[i + 2] = color[2]
      px[i + 3] = color[3]
    }
  }
  // raw scanlines, each prefixed with filter-type byte 0
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    Buffer.from(px.buffer, y * size * 4, size * 4).copy(raw, y * (size * 4 + 1) + 1)
  }
  const idat = deflateSync(raw)
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync('public/icons', { recursive: true })

const targets = [
  { file: 'icon-192.png', size: 192, scale: 1 },
  { file: 'icon-512.png', size: 512, scale: 1 },
  { file: 'icon-1024.png', size: 1024, scale: 1 },
  // maskable: shrink into the safe zone so the mark isn't clipped by icon masks
  { file: 'icon-512-maskable.png', size: 512, scale: 0.66 },
  { file: 'apple-touch-icon.png', size: 180, scale: 1 },
]

for (const t of targets) {
  const png = makePng(t.size, t)
  writeFileSync(`public/icons/${t.file}`, png)
  console.log('wrote', t.file)
}
