'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

function createCloudTexture(size: number): THREE.DataTexture {
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
      let n = vn(u, v, 3) * 0.52 + vn(u, v, 8) * 0.30 + vn(u, v, 19) * 0.13 + vn(u, v, 42) * 0.05
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

export default function MonolithScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth || 440
    const H = mount.clientHeight || 440

    // In r163+, OutputPass handles sRGB encoding — renderer must stay in linear to avoid double-gamma
    // alpha:true → transparent canvas; CSS backgroundColor on the wrapper div handles #111418 exactly,
    // bypassing ACES tone-mapping which would subtly shift the background color.
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    })
    renderer.setSize(W, H, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping         = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.72
    renderer.outputColorSpace    = THREE.LinearSRGBColorSpace
    renderer.shadowMap.enabled   = false
    renderer.setClearColor(0x000000, 0)
    renderer.setClearAlpha(0)
    renderer.domElement.style.background = 'transparent'
    renderer.domElement.style.display = 'block'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    // No scene.background — transparent canvas lets CSS #111418 show through pixel-perfectly

    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 50)
    camera.position.set(0.35, 0.15, 6.8)
    camera.lookAt(0, -0.1, 0)
    camera.updateProjectionMatrix()

    // ── RoomEnvironment env map ───────────────────────────────────────
    RectAreaLightUniformsLib.init()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.03).texture
    scene.environment = envMap
    pmrem.dispose()

    // ── Value-noise roughness — fine frost grain ─────────────────────
    const noiseSize = 256
    const noiseData = new Uint8Array(noiseSize * noiseSize * 4)
    const h2 = (xi: number, yi: number) => {
      let h = ((xi * 1231 + yi * 3571) & 0x7fffffff)
      h = ((h ^ (h >> 16)) * 0x45d9f3b) & 0x7fffffff
      h = ((h ^ (h >> 16)) * 0x45d9f3b) & 0x7fffffff
      return (h & 0xff) / 255.0
    }
    const ss = (t: number) => t * t * (3 - 2 * t)
    const vn = (px: number, py: number) => {
      const xi = Math.floor(px), yi = Math.floor(py)
      const xf = ss(px - xi), yf = ss(py - yi)
      const a = h2(xi, yi), b = h2(xi + 1, yi), c = h2(xi, yi + 1), d = h2(xi + 1, yi + 1)
      return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf
    }
    for (let py = 0; py < noiseSize; py++) {
      for (let px = 0; px < noiseSize; px++) {
        const idx = (py * noiseSize + px) * 4
        const nx = px / noiseSize * 6, ny = py / noiseSize * 6
        const n  = vn(nx, ny) * 0.55 + vn(nx * 2.1, ny * 2.1) * 0.30 + vn(nx * 4.3, ny * 4.3) * 0.15
        const v  = Math.round(85 + n * 150)
        noiseData[idx] = noiseData[idx + 1] = noiseData[idx + 2] = v
        noiseData[idx + 3] = 255
      }
    }
    const roughnessTex = new THREE.DataTexture(noiseData, noiseSize, noiseSize, THREE.RGBAFormat)
    roughnessTex.wrapS = roughnessTex.wrapT = THREE.RepeatWrapping
    roughnessTex.repeat.set(3, 10)
    roughnessTex.needsUpdate = true

    // ── Slab group ────────────────────────────────────────────────────
    const slabGroup = new THREE.Group()
    slabGroup.rotation.y = -0.11
    slabGroup.rotation.x = -0.015
    slabGroup.scale.setScalar(0.84)
    scene.add(slabGroup)

    // Near-sharp corners (radius 0.02) — matches architectural glass prism
    const geo = new RoundedBoxGeometry(0.85, 2.28, 0.48, 4, 0.030)

    // ① Main glass — darker, more frosted, less like glowing plastic
    const mat = new THREE.MeshPhysicalMaterial({
      color:               new THREE.Color(0x91aa8d),
      transmission:        0.62,
      thickness:           0.75,
      roughness:           0.88,
      roughnessMap:        roughnessTex,
      metalness:           0.0,
      ior:                 1.45,
      attenuationColor:    new THREE.Color(0x8dbe86),
      attenuationDistance: 1.35,
      specularIntensity:   0.32,
      envMapIntensity:     0.65,
      transparent:         true,
      opacity:             0.38,
      side:                THREE.DoubleSide,
      depthWrite:          false,
    })
    slabGroup.add(new THREE.Mesh(geo, mat))

    // ② Inner glow shell — BackSide, soft pale green seen through glass
    const innerGeo = new RoundedBoxGeometry(0.79, 2.22, 0.42, 4, 0.018)
    const innerMat = new THREE.MeshBasicMaterial({
      color:       new THREE.Color(0xc8f5e0),
      transparent: true,
      opacity:     0.14,
      side:        THREE.BackSide,
    })
    slabGroup.add(new THREE.Mesh(innerGeo, innerMat))

    // ③ Cloud/frost inner plane
    const cloudTex = createCloudTexture(256)
    const frostMat = new THREE.MeshBasicMaterial({
      color: 0xaacaa3,
      map: cloudTex,
      transparent: true,
      opacity: 0.20,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const frostPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.85 * 0.72, 2.28 * 0.78),
      frostMat
    )
    frostPlane.position.z = 0.01
    slabGroup.add(frostPlane)

    // ④ Edge strips — thin bevelled glowing frame
    const edgeMat = new THREE.MeshBasicMaterial({
      color: 0xc9ffd0,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    function makeStrip(w: number, h: number, d: number, x: number, y: number, z: number) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), edgeMat)
      mesh.position.set(x, y, z)
      return mesh
    }
    const frontZ = 0.48 / 2 + 0.018
    slabGroup.add(makeStrip(0.026, 2.28 - 0.14, 0.018, -0.85 / 2 + 0.045,  0,     frontZ))
    slabGroup.add(makeStrip(0.026, 2.28 - 0.14, 0.018,  0.85 / 2 - 0.045,  0,     frontZ))
    slabGroup.add(makeStrip(0.85 - 0.13, 0.026, 0.018,  0,  2.28 / 2 + 0.005,     frontZ))
    slabGroup.add(makeStrip(0.85 - 0.13, 0.035, 0.020,  0, -2.28 / 2 + 0.105,     frontZ))

    // ── Green ground glow ─────────────────────────────────────────────
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
    const glowTex = new THREE.CanvasTexture(gCanvas)

    const glowGeo = new THREE.PlaneGeometry(4.0, 2.8)
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTex, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const glowPlane = new THREE.Mesh(glowGeo, glowMat)
    glowPlane.rotation.x = -Math.PI / 2
    const floorY = -1.00
    glowPlane.position.set(0.10, floorY, 0.25)
    scene.add(glowPlane)

    // ── Lighting ──────────────────────────────────────────────────────
    const keyLight = new THREE.RectAreaLight(0xdffff0, 2.2, 4.0, 5.0)
    keyLight.position.set(-2.5, 3.4, 3.0)
    keyLight.lookAt(0, 2.0, 0)
    scene.add(keyLight)

    const rightRim = new THREE.RectAreaLight(0xa8ffc3, 1.15, 1.0, 4.2)
    rightRim.position.set(1.9, 2.6, -1.1)
    rightRim.lookAt(0, 2.0, 0)
    scene.add(rightRim)

    const baseLight = new THREE.PointLight(0x86ff8e, 1.7, 4.0, 2.0)
    baseLight.position.set(0, 0.08, 0.28)
    scene.add(baseLight)

    const topFill = new THREE.DirectionalLight(0xeaffea, 0.12)
    topFill.position.set(-1.5, 4.5, 2.2)
    scene.add(topFill)

    scene.add(new THREE.AmbientLight(0xffffff, 0.04))

    // ── Post-processing ───────────────────────────────────────────────
    const composer = new EffectComposer(renderer)

    const renderPass = new RenderPass(scene, camera)
    renderPass.clear = true
    renderPass.clearAlpha = 0
    composer.addPass(renderPass)

    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.36, 0.72, 0.22)
    bloom.threshold = 0.22
    bloom.strength  = 0.36
    bloom.radius    = 0.72
    composer.addPass(bloom)

    composer.addPass(new OutputPass())

    const alphaFixPass = new ShaderPass({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          float brightness = max(max(color.r, color.g), color.b);
          float alpha = smoothstep(0.005, 0.08, brightness);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
    })
    alphaFixPass.material.transparent = true
    composer.addPass(alphaFixPass)

    // ── Animation ─────────────────────────────────────────────────────
    let raf: number
    let isPaused = false
    const clock = new THREE.Clock()
    let t = 0
    let lastFrame = 0
    const FRAME_MS = 1000 / 30 // 30fps cap — halves main-thread CPU vs 60fps
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (isPaused) return
      if (now - lastFrame < FRAME_MS) return
      lastFrame = now
      t += clock.getDelta()
      const f             = Math.sin(t * 0.62) * 0.07
      slabGroup.position.y = f
      glowPlane.position.y = floorY + f * 0.20
      slabGroup.rotation.y = -0.11 + Math.sin(t * 0.40) * 0.012
      composer.render()
    }
    tick(0)

    const vio = new IntersectionObserver(
      ([entry]) => { isPaused = !entry.isIntersecting },
      { threshold: 0 }
    )
    vio.observe(mount)

    const ro = new ResizeObserver(() => {
      if (!mount) return
      const w = mount.clientWidth, h = mount.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
      composer.setSize(w, h)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      vio.disconnect()
      ro.disconnect()
      composer.dispose()
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      frostMat.dispose()
      cloudTex.dispose()
      edgeMat.dispose()
      roughnessTex.dispose()
      glowGeo.dispose()
      glowMat.dispose()
      glowTex.dispose()
      envMap.dispose()
      keyLight.dispose()
      rightRim.dispose()
      baseLight.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="w-full h-full bg-transparent"
      aria-hidden="true"
    />
  )
}
