'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { SheetProvider, editable as e } from '@theatre/r3f'
import { getProject } from '@theatre/core'
import { useEffect, useMemo, useRef } from 'react'
import type React from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

// ponytail: dev-only studio, dynamic import keeps it out of prod bundle
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  import('@theatre/studio').then(s => s.default.initialize())
}

const project = getProject('Monolith')
const sheet = project.sheet('Hero')

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

function makeNoiseTexture(): THREE.DataTexture {
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

function makeGlowTexture(): THREE.CanvasTexture {
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

const ALPHA_FIX = {
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
}

function SceneContent({ scrollRef }: { scrollRef?: React.RefObject<number> }) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef<EffectComposer | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slabGroupRef = useRef<any>(null)
  const baseLightRef = useRef<THREE.PointLight>(null)
  const glowPlaneRef = useRef<THREE.Mesh>(null)
  const keyLightRef = useRef<THREE.RectAreaLight>(null)
  const rightRimRef = useRef<THREE.RectAreaLight>(null)
  const entranceDoneRef = useRef(false)
  const lastFrameRef = useRef(0)
  const tRef = useRef(0)
  const isPausedRef = useRef(false)

  const roughnessTex = useMemo(() => makeNoiseTexture(), [])
  const mainGeo = useMemo(() => new RoundedBoxGeometry(0.85, 2.28, 0.48, 4, 0.030), [])
  const mainMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x91aa8d),
    transmission: 0.62,
    thickness: 0.75,
    roughness: 0.88,
    roughnessMap: roughnessTex,
    metalness: 0.0,
    ior: 1.45,
    attenuationColor: new THREE.Color(0x8dbe86),
    attenuationDistance: 1.35,
    specularIntensity: 0.32,
    envMapIntensity: 0.65,
    transparent: true,
    opacity: 0.38,
    side: THREE.DoubleSide,
    depthWrite: false,
  }), [roughnessTex])

  const innerGeo = useMemo(() => new RoundedBoxGeometry(0.79, 2.22, 0.42, 4, 0.018), [])
  const innerMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xc8f5e0),
    transparent: true,
    opacity: 0.14,
    side: THREE.BackSide,
  }), [])

  const cloudTex = useMemo(() => createCloudTexture(256), [])
  const frostMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xaacaa3,
    map: cloudTex,
    transparent: true,
    opacity: 0.20,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), [cloudTex])

  const edgeMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xc9ffd0,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [])

  const glowTex = useMemo(() => makeGlowTexture(), [])
  const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
    map: glowTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [glowTex])

  useEffect(() => {
    camera.lookAt(0, -0.1, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  useEffect(() => {
    keyLightRef.current?.lookAt(0, 2.0, 0)
    rightRimRef.current?.lookAt(0, 2.0, 0)
  }, [])

  useEffect(() => {
    RectAreaLightUniformsLib.init()
    const pmrem = new THREE.PMREMGenerator(gl)
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.03).texture
    scene.environment = envMap
    pmrem.dispose()
    return () => { envMap.dispose() }
  }, [gl, scene])

  // EffectComposer — re-created on resize; priority-1 useFrame prevents R3F's own render
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 0.72
    gl.outputColorSpace = THREE.LinearSRGBColorSpace
    gl.setClearColor(0x000000, 0)
    gl.setClearAlpha(0)

    const { width, height } = size
    const composer = new EffectComposer(gl)
    const renderPass = new RenderPass(scene, camera)
    renderPass.clear = true
    renderPass.clearAlpha = 0
    composer.addPass(renderPass)

    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.36, 0.72, 0.22)
    bloom.threshold = 0.22
    bloom.strength  = 0.36
    bloom.radius    = 0.72
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    const alphaFix = new ShaderPass(ALPHA_FIX)
    alphaFix.material.transparent = true
    composer.addPass(alphaFix)

    composerRef.current = composer
    return () => {
      composer.dispose()
      composerRef.current = null
    }
  }, [gl, scene, camera, size])

  // Theatre.js entrance; sets entranceDoneRef so scroll doesn't fight the playback
  useEffect(() => {
    sheet.sequence.play({ range: [0, 1.2] }).then(() => {
      entranceDoneRef.current = true
    })
  }, [])

  useEffect(() => {
    const canvas = gl.domElement
    const vio = new IntersectionObserver(
      ([entry]) => { isPausedRef.current = !entry.isIntersecting },
      { threshold: 0 }
    )
    vio.observe(canvas)
    return () => vio.disconnect()
  }, [gl])

  useEffect(() => {
    return () => {
      mainGeo.dispose(); mainMat.dispose()
      innerGeo.dispose(); innerMat.dispose()
      frostMat.dispose(); cloudTex.dispose()
      edgeMat.dispose(); roughnessTex.dispose()
      glowMat.dispose(); glowTex.dispose()
    }
  }, [mainGeo, mainMat, innerGeo, innerMat, frostMat, cloudTex, edgeMat, roughnessTex, glowMat, glowTex])

  // priority 1 → R3F skips its own render; we call composer.render() ourselves
  useFrame(() => {
    if (isPausedRef.current || !composerRef.current) return
    const now = performance.now()
    if (now - lastFrameRef.current < 1000 / 30) return
    const dt = (now - lastFrameRef.current) / 1000
    lastFrameRef.current = now
    tRef.current += dt
    const t = tRef.current

    const sp = scrollRef?.current ?? 0
    const f = Math.sin(t * 0.62) * 0.07

    // Advance Theatre sequence driven by scroll (after entrance completes)
    if (entranceDoneRef.current) {
      sheet.sequence.position = 1.2 + sp * 2
    }

    // ponytail: lerp camera Z so pull-back feels physical rather than instant
    camera.position.z += (6.8 + sp * 1.8 - camera.position.z) * 0.05

    const sg = slabGroupRef.current
    if (sg) {
      sg.position.y = f - sp * 0.5
      sg.rotation.y = -0.11 + Math.sin(t * 0.40) * 0.012 + sp * 0.35
    }

    const gp = glowPlaneRef.current
    if (gp) gp.position.y = -1.00 + f * 0.20 - sp * 0.5

    const bl = baseLightRef.current
    if (bl) bl.intensity = 1.7 * (1 - sp * 0.4)

    composerRef.current.render()
  }, 1)

  const FRONT_Z = 0.48 / 2 + 0.018

  return (
    <>
      {/* e.group makes this editable in Theatre studio */}
      <e.group
        theatreKey="SlabGroup"
        ref={slabGroupRef}
        rotation-y={-0.11}
        rotation-x={-0.015}
        scale={0.84}
      >
        <mesh geometry={mainGeo} material={mainMat} />
        <mesh geometry={innerGeo} material={innerMat} />
        <mesh material={frostMat} position-z={0.01}>
          <planeGeometry args={[0.85 * 0.72, 2.28 * 0.78]} />
        </mesh>
        {/* edge strips */}
        <mesh material={edgeMat} position={[-0.85 / 2 + 0.045, 0, FRONT_Z]}>
          <boxGeometry args={[0.026, 2.28 - 0.14, 0.018]} />
        </mesh>
        <mesh material={edgeMat} position={[0.85 / 2 - 0.045, 0, FRONT_Z]}>
          <boxGeometry args={[0.026, 2.28 - 0.14, 0.018]} />
        </mesh>
        <mesh material={edgeMat} position={[0, 2.28 / 2 + 0.005, FRONT_Z]}>
          <boxGeometry args={[0.85 - 0.13, 0.026, 0.018]} />
        </mesh>
        <mesh material={edgeMat} position={[0, -2.28 / 2 + 0.105, FRONT_Z]}>
          <boxGeometry args={[0.85 - 0.13, 0.035, 0.020]} />
        </mesh>
      </e.group>

      <mesh
        ref={glowPlaneRef}
        rotation-x={-Math.PI / 2}
        position={[0.10, -1.00, 0.25]}
        material={glowMat}
      >
        <planeGeometry args={[4.0, 2.8]} />
      </mesh>

      <rectAreaLight ref={keyLightRef} color={0xdffff0} intensity={2.2} width={4.0} height={5.0} position={[-2.5, 3.4, 3.0]} />
      <rectAreaLight ref={rightRimRef} color={0xa8ffc3} intensity={1.15} width={1.0} height={4.2} position={[1.9, 2.6, -1.1]} />
      <pointLight ref={baseLightRef} color={0x86ff8e} intensity={1.7} distance={4.0} decay={2.0} position={[0, 0.08, 0.28]} />
      <directionalLight color={0xeaffea} intensity={0.12} position={[-1.5, 4.5, 2.2]} />
      <ambientLight color={0xffffff} intensity={0.04} />
    </>
  )
}

interface Props {
  scrollRef?: React.RefObject<number>
}

export default function MonolithScene({ scrollRef }: Props = {}) {
  return (
    <div className="w-full h-full bg-transparent" aria-hidden="true">
      <Canvas
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
        camera={{ fov: 35, near: 0.1, far: 50, position: [0.35, 0.15, 6.8] }}
        dpr={[1, 2]}
        style={{ background: 'transparent', display: 'block', width: '100%', height: '100%' }}
      >
        <SheetProvider sheet={sheet}>
          <SceneContent scrollRef={scrollRef} />
        </SheetProvider>
      </Canvas>
    </div>
  )
}
