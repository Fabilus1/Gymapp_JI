// Generates simple monogram PNG icons for the PWA manifest without any
// image/canvas dependency — just raw PNG chunk writing + zlib deflate.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const BG = [10, 10, 12, 255] // near-black background
const ACCENT = [205, 250, 80, 255] // #CDFA50 volt accent

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

// draws a filled circle (the "plate" mark) of given radius fraction, centered
function makePng(size, { circleFraction, padding = 0 }) {
  const px = new Uint8Array(size * size * 4)
  const cx = size / 2
  const cy = size / 2
  const r = (size / 2 - padding) * circleFraction
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx + 0.5
      const dy = y - cy + 0.5
      const dist = Math.sqrt(dx * dx + dy * dy)
      const i = (y * size + x) * 4
      const color = dist <= r ? ACCENT : BG
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
  { file: 'icon-192.png', size: 192, circleFraction: 0.62, padding: 0 },
  { file: 'icon-512.png', size: 512, circleFraction: 0.62, padding: 0 },
  { file: 'icon-512-maskable.png', size: 512, circleFraction: 0.5, padding: 60 },
  { file: 'apple-touch-icon.png', size: 180, circleFraction: 0.62, padding: 0 },
]

for (const t of targets) {
  const png = makePng(t.size, t)
  writeFileSync(`public/icons/${t.file}`, png)
  console.log('wrote', t.file)
}
