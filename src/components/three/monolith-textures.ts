// Only ever loaded client-side: MonolithScene (the sole consumer) is always
// imported via next/dynamic with ssr: false, so makeGlowTexture's use of
// document is safe here.
import * as THREE from 'three'

export function createCloudTexture(size: number): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4)
  const r2 = (ix: number, iy: number) => {
    let h = ((ix * 127 + iy * 311) & 0x7fffffff)
    h = ((h ^ (h >> 16)) * 0x45d9f3b) & 0x7fffffff
    return (h & 0xff) / 255
  }
  const sm = (t: number) => t * t * (3 - 2 * t)
  const vn = (x: number, y: number, sc: number) => {
    x *= sc; y *= sc
    const x0 = Math.floor(x), y0 = Math.floor(y)
    const sx = sm(x - x0), sy = sm(y - y0)
    const a = r2(x0, y0), b = r2(x0+1, y0), c = r2(x0, y0+1), d = r2(x0+1, y0+1)
    return a + (b-a)*sx + (c-a)*sy + (a-b-c+d)*sx*sy
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size
      const n = vn(u, v, 3) * 0.52 + vn(u, v, 8) * 0.30 + vn(u, v, 19) * 0.13 + vn(u, v, 42) * 0.05
      const dx = Math.abs(u - 0.5) * 2, dy = Math.abs(v - 0.5) * 2
      const mask = Math.max(0, 1 - Math.pow(Math.max(dx * 0.75, dy * 0.62), 1.6))
      const i = (y * size + x) * 4
      const shade = 150 + n * 70
      data[i]   = shade
      data[i+1] = shade + 18
      data[i+2] = shade - 10
      data[i+3] = Math.round(18 + n * mask * 110)
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.needsUpdate = true
  return tex
}

export function makeNoiseTexture(): THREE.DataTexture {
  const noiseSize = 256
  const noiseData = new Uint8Array(noiseSize * noiseSize * 4)
  const h2 = (xi: number, yi: number) => {
    let h = ((xi * 1231 + yi * 3571) & 0x7fffffff)
    h = ((h ^ (h >> 16)) * 0x45d9f3b) & 0x7fffffff
    h = ((h ^ (h >> 16)) * 0x45d9f3b) & 0x7fffffff
    return (h & 0xff) / 255.0
  }
  const ss = (t: number) => t * t * (3 - 2 * t)
  const vn2 = (px: number, py: number) => {
    const xi = Math.floor(px), yi = Math.floor(py)
    const xf = ss(px - xi), yf = ss(py - yi)
    const a = h2(xi, yi), b = h2(xi + 1, yi), c = h2(xi, yi + 1), d = h2(xi + 1, yi + 1)
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf
  }
  for (let py = 0; py < noiseSize; py++) {
    for (let px = 0; px < noiseSize; px++) {
      const idx = (py * noiseSize + px) * 4
      const nx = px / noiseSize * 6, ny = py / noiseSize * 6
      const n = vn2(nx, ny) * 0.55 + vn2(nx * 2.1, ny * 2.1) * 0.30 + vn2(nx * 4.3, ny * 4.3) * 0.15
      const v = Math.round(85 + n * 150)
      noiseData[idx] = noiseData[idx + 1] = noiseData[idx + 2] = v
      noiseData[idx + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(noiseData, noiseSize, noiseSize, THREE.RGBAFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 10)
  tex.needsUpdate = true
  return tex
}

export function makeGlowTexture(): THREE.CanvasTexture {
  const gCanvas = document.createElement('canvas')
  gCanvas.width = gCanvas.height = 512
  const gCtx = gCanvas.getContext('2d')!
  gCtx.clearRect(0, 0, 512, 512)
  const gGrad = gCtx.createRadialGradient(256, 256, 0, 256, 256, 256)
  gGrad.addColorStop(0.00, 'rgba(74, 222, 128, 0.75)')
  gGrad.addColorStop(0.22, 'rgba(50, 200, 105, 0.42)')
  gGrad.addColorStop(0.45, 'rgba(22, 130,  70, 0.18)')
  gGrad.addColorStop(0.70, 'rgba(8,   65,  35, 0.06)')
  gGrad.addColorStop(1.00, 'rgba(0,    0,   0, 0.00)')
  gCtx.fillStyle = gGrad
  gCtx.fillRect(0, 0, 512, 512)
  return new THREE.CanvasTexture(gCanvas)
}
