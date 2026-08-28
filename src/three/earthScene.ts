// 神游 · 3D 地球场景
//
// 标记不是"文化圈圆点"，而是**故事级 emoji 标记**：一个 emoji = 一个故事，
// 同国家的多个故事围绕该国坐标做确定性散布。
// 另含：背面标记自动隐藏、悬停显示故事名、按国家聚焦、裂开进入地心转场。

import * as THREE from 'three'
import { assetUrl } from '../utils/assetUrl'

export interface StoryMarker {
  key: string
  emoji: string
  title: string
  countryId: string
  countryName: string
  lat: number
  lon: number
  status: 'ready' | 'planned'
  storyId?: string
}

const vert = /* glsl */ `
  varying vec3 vN;
  uniform float uSplit;
  uniform float uSide;
  void main(){
    vN = normalize(position);
    vec3 p = position;
    p.y += uSide * uSplit;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const frag = /* glsl */ `
  #define PI 3.14159265359
  uniform sampler2D uMap;
  uniform sampler2D uNightMap;
  uniform float uCrack;
  uniform float uTime;
  uniform float uNight;
  varying vec3 vN;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i=0;i<4;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    float u = atan(vN.z, vN.x)/(2.0*PI) + 0.5;
    float v = asin(clamp(vN.y, -1.0, 1.0))/PI + 0.5;
    vec2 uv = vec2(u, v);

    // 白天贴图
    vec3 dayCol = texture2D(uMap, uv).rgb;
    float lambert = 0.55 + 0.45 * max(dot(vN, normalize(vec3(0.45,0.35,0.85))), 0.0);
    dayCol *= lambert;

    // 夜景贴图：城市灯光 + 深蓝海洋 + 微光地形
    vec3 nightCol = texture2D(uNightMap, uv).rgb;
    // 灯光微闪烁（万家灯火的呼吸感）
    float twinkle = 0.92 + 0.08 * sin(uTime * 2.2 + hash(uv * 13.0) * 6.28);
    nightCol *= twinkle;

    // 混合
    vec3 col = mix(dayCol, nightCol, uNight);

    // 大气层蓝色边缘光（夜览时）
    float fresnel = pow(1.0 - abs(dot(vN, normalize(vec3(0.0, 0.0, 1.0)))), 2.5);
    vec3 atmo = vec3(0.15, 0.35, 0.85) * fresnel * 0.6;
    col += atmo * uNight;

    // 裂纹
    float jitter = (fbm(vec2(u*9.0, 2.0)) - 0.5) * 0.13;
    float d = abs(v - 0.5 + jitter);
    float lineW = mix(0.004, 0.03, uCrack);
    float crack = smoothstep(lineW, 0.0, d) * uCrack;
    float halo = smoothstep(lineW*4.5, 0.0, d) * uCrack * 0.55;
    vec3 gold = vec3(1.0, 0.86, 0.52);

    col = mix(col, gold, clamp(crack*1.15, 0.0, 1.0));
    col += gold * halo * (0.75 + 0.25*sin(uTime*6.0));

    gl_FragColor = vec4(col, 1.0);
  }
`

const ease = {
  outQuad: (t: number) => 1 - (1 - t) * (1 - t),
  inQuad: (t: number) => t * t,
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t: number) => {
    const c1 = 1.35, c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
}

const TL = { A: 350, B: 500, C: 500, D: 450 }
const TOTAL = TL.A + TL.B + TL.C + TL.D

function latLonToVec3(lat: number, lon: number, r = 1.015) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

/** 字符串 → [0,1) 确定性伪随机，用于同国家多故事的散布 */
function hash01(str: string, salt = 0): number {
  let h = 2166136261 ^ salt
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 100000) / 100000
}

// ---------- 兜底地球贴图（贴图 404 时不至于变黑球）----------
function fallbackEarthTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const g = c.getContext('2d')!
  g.fillStyle = '#DCE9EC'
  g.fillRect(0, 0, c.width, c.height)
  g.fillStyle = '#CBBE93'
  const blobs: [number, number, number, number][] = [
    [120, 130, 110, 70], [150, 250, 70, 90], [300, 120, 60, 50],
    [470, 140, 90, 70], [500, 250, 70, 100], [600, 120, 150, 80],
    [700, 200, 90, 60], [820, 300, 70, 45], [500, 470, 400, 40],
  ]
  blobs.forEach(([x, y, w, h]) => {
    g.beginPath(); g.ellipse(x, y, w, h, 0, 0, Math.PI * 2); g.fill()
  })
  g.strokeStyle = 'rgba(140,125,95,0.28)'
  g.lineWidth = 1
  for (let i = 1; i < 12; i++) { g.beginPath(); g.moveTo((c.width/12)*i, 0); g.lineTo((c.width/12)*i, c.height); g.stroke() }
  for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, (c.height/6)*i); g.lineTo(c.width, (c.height/6)*i); g.stroke() }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// ---------- emoji 标记贴图（按 emoji + 状态缓存）----------
const emojiTexCache = new Map<string, THREE.CanvasTexture>()
function emojiTexture(emoji: string, ready: boolean): THREE.CanvasTexture {
  const key = `${emoji}|${ready ? 'r' : 'p'}`
  const cached = emojiTexCache.get(key)
  if (cached) return cached

  const S = 128
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')!

  // 已撰写：暖金光晕托底；待撰写：淡淡一层，视觉上更弱
  const rg = g.createRadialGradient(S / 2, S / 2, 2, S / 2, S / 2, S / 2)
  if (ready) {
    rg.addColorStop(0, 'rgba(255,244,206,0.95)')
    rg.addColorStop(0.45, 'rgba(228,183,74,0.55)')
    rg.addColorStop(1, 'rgba(201,162,39,0)')
  } else {
    rg.addColorStop(0, 'rgba(255,250,235,0.42)')
    rg.addColorStop(0.5, 'rgba(200,190,165,0.22)')
    rg.addColorStop(1, 'rgba(200,190,165,0)')
  }
  g.fillStyle = rg
  g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); g.fill()

  g.font = `${Math.round(S * 0.52)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.globalAlpha = ready ? 1 : 0.72
  g.fillText(emoji, S / 2, S / 2 + S * 0.02)

  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  emojiTexCache.set(key, t)
  return t
}

export interface EarthSceneOptions {
  container: HTMLElement
  markers: StoryMarker[]
  onMarkerTap: (m: StoryMarker) => void
  onMarkerHover?: (m: StoryMarker | null, screen?: { x: number; y: number }) => void
  onFlash?: (opacity: number) => void
  onEnterCoreDone?: () => void
}

export function createEarthScene(opts: EarthSceneOptions) {
  const { container, markers: markerData, onMarkerTap, onMarkerHover, onFlash, onEnterCoreDone } = opts

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100)
  function homeZ() {
    // 桌面端相机退得更远，避免地球顶到顶部标题区与底部按钮
    return container.clientWidth / container.clientHeight > 1 ? 4.6 : 3.3
  }
  camera.position.set(0, 0, homeZ())

  const earthGroup = new THREE.Group()
  scene.add(earthGroup)

  const tex: { value: THREE.Texture } = { value: fallbackEarthTexture() }
  const nightTex: { value: THREE.Texture } = { value: fallbackEarthTexture() }
  const textureState = { loaded: false, failed: false, nightLoaded: false }

  // 追踪所有地球 shader 材质，纹理加载完成后更新引用
  const earthMaterials: THREE.ShaderMaterial[] = []

  const loader = new THREE.TextureLoader()
  loader.load(
    assetUrl('earth-texture.jpg'),
    (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace
      textureState.loaded = true
      tex.value = loaded
      earthMaterials.forEach((m) => { m.uniforms.uMap.value = loaded })
    },
    undefined,
    () => {
      textureState.failed = true
      console.error('[earthScene] 地球贴图加载失败，已回退兜底贴图：', assetUrl('earth-texture.jpg'))
    },
  )
  loader.load(
    assetUrl('earth-night.jpg'),
    (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace
      textureState.nightLoaded = true
      nightTex.value = loaded
      earthMaterials.forEach((m) => { m.uniforms.uNightMap.value = loaded })
    },
    undefined,
    () => {
      console.error('[earthScene] 夜景贴图加载失败：', assetUrl('earth-night.jpg'))
    },
  )

  function hemisphere(side: number) {
    const geo = new THREE.SphereGeometry(1, 96, 48, 0, Math.PI * 2, side > 0 ? 0 : Math.PI / 2, Math.PI / 2)
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uMap: { value: tex.value },
        uNightMap: { value: nightTex.value },
        uCrack: { value: 0 },
        uSplit: { value: 0 },
        uSide: { value: side },
        uTime: { value: 0 },
        uNight: { value: 0 },
      },
    })
    earthMaterials.push(mat)
    return new THREE.Mesh(geo, mat)
  }

  const top = hemisphere(1)
  const bot = hemisphere(-1)
  earthGroup.add(top, bot)

  new THREE.TextureLoader().load(
    assetUrl('earth-texture.jpg'),
    (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace
      textureState.loaded = true
      ;(top.material as THREE.ShaderMaterial).uniforms.uMap.value = loaded
      ;(bot.material as THREE.ShaderMaterial).uniforms.uMap.value = loaded
    },
    undefined,
    () => {
      textureState.failed = true
      console.error('[earthScene] 地球贴图加载失败，已回退兜底贴图：', assetUrl('earth-texture.jpg'))
    },
  )

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.965, 48, 32),
    new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      uniforms: { uI: { value: 0 } },
      vertexShader: `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform float uI; varying vec3 vN;
        void main(){
          float f = pow(1.0 - abs(vN.z), 1.6);
          gl_FragColor = vec4(vec3(1.0,0.9,0.62) * f * uI, f * uI);
        }`,
    }),
  )
  earthGroup.add(core)

  // ---------- 故事 emoji 标记 ----------
  const sprites: THREE.Sprite[] = markerData.map((m) => {
    // 同国家多故事：按标题哈希做确定性散布，避免叠在一点
    const jLat = (hash01(m.key, 1) - 0.5) * 9
    const jLon = (hash01(m.key, 2) - 0.5) * 11
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: emojiTexture(m.emoji, m.status === 'ready'),
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    )
    s.position.copy(latLonToVec3(m.lat + jLat, m.lon + jLon))
    s.scale.setScalar(m.status === 'ready' ? 0.11 : 0.088)
    ;(s as any).userData = m
    earthGroup.add(s)
    return s
  })

  // ---------- 交互 ----------
  let rotY = -0.5
  let rotX = 0.18
  const spin = 0.0012
  let dragging = false
  let moved = 0
  let lastX = 0
  let lastY = 0
  let downT = 0
  let velY = 0
  let locked = false
  let hovered: THREE.Sprite | null = null
  /** 国家聚焦动画 */
  let focus: { fromY: number; toY: number; fromX: number; toX: number; t0: number } | null = null

  const ray = new THREE.Raycaster()
  ;(ray.params as any).Sprite = { threshold: 0.06 }
  const ndc = new THREE.Vector2()

  function pointFrom(e: MouseEvent | TouchEvent) {
    return 'touches' in e
      ? (e.touches[0] || (e as TouchEvent).changedTouches[0])
      : (e as MouseEvent)
  }

  function pickAt(clientX: number, clientY: number): THREE.Intersection | null {
    const rect = container.getBoundingClientRect()
    ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1
    ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1
    ray.setFromCamera(ndc, camera)
    // 只在可见（朝向镜头）的标记里选
    const visibleSprites = sprites.filter((s) => s.visible && s.material.opacity > 0.25)
    return ray.intersectObjects(visibleSprites, false)[0] || null
  }

  function onDown(e: MouseEvent | TouchEvent) {
    if (locked) return
    dragging = true
    moved = 0
    downT = performance.now()
    const p = pointFrom(e)
    lastX = p.clientX
    lastY = p.clientY
  }

  function onMove(e: MouseEvent | TouchEvent) {
    const p = pointFrom(e)
    if (!p) return

    if (dragging && !locked) {
      const dx = p.clientX - lastX
      const dy = p.clientY - lastY
      moved += Math.hypot(dx, dy)
      rotY += dx * 0.0055
      rotX = Math.max(-0.85, Math.min(0.85, rotX + dy * 0.004))
      velY = dx * 0.0055
      lastX = p.clientX
      lastY = p.clientY
      focus = null
      return
    }

    // 悬停（桌面）
    if (!('touches' in e) && !locked && onMarkerHover) {
      const hit = pickAt(p.clientX, p.clientY)
      const sp = (hit?.object as THREE.Sprite) || null
      if (sp !== hovered) {
        hovered = sp
        onMarkerHover(sp ? ((sp as any).userData as StoryMarker) : null, { x: p.clientX, y: p.clientY })
        container.style.cursor = sp ? 'pointer' : 'grab'
      } else if (sp) {
        onMarkerHover((sp as any).userData as StoryMarker, { x: p.clientX, y: p.clientY })
      }
    }
  }

  function onUp(e: MouseEvent | TouchEvent) {
    if (!dragging || locked) { dragging = false; return }
    dragging = false
    const dt = performance.now() - downT
    if (moved < 8 && dt < 260) {
      const p = pointFrom(e)
      const hit = pickAt(p.clientX, p.clientY)
      if (hit) onMarkerTap((hit.object as any).userData as StoryMarker)
    }
  }

  const el = renderer.domElement
  el.style.cursor = 'grab'
  el.addEventListener('mousedown', onDown)
  el.addEventListener('touchstart', onDown, { passive: true })
  el.addEventListener('mousemove', onMove)
  el.addEventListener('touchmove', onMove, { passive: true })
  el.addEventListener('mouseup', onUp)
  el.addEventListener('touchend', onUp)
  el.addEventListener('mouseleave', () => {
    if (hovered) { hovered = null; onMarkerHover?.(null) }
  })

  // ---------- 转场 ----------
  let anim: { dir: 1 | -1; t0: number } | null = null
  function startTransition(dir: 1 | -1) {
    if (anim || locked) return
    locked = true
    anim = { dir, t0: performance.now() }
    if (hovered) { hovered = null; onMarkerHover?.(null) }
  }

  function applyTransition(p: number) {
    const tA = TL.A / TOTAL
    const tB = (TL.A + TL.B) / TOTAL
    const tC = (TL.A + TL.B + TL.C) / TOTAL

    const a = Math.min(p / tA, 1)
    const shrink = 1 - 0.05 * ease.outQuad(a)
    const b = p <= tA ? 0 : Math.min((p - tA) / (tB - tA), 1)
    const crack = ease.inOutSine(b)
    const c = p <= tB ? 0 : Math.min((p - tB) / (tC - tB), 1)
    const split = 0.62 * ease.outBack(c)
    const z0 = homeZ()
    const dolly = z0 - (z0 - 1.15) * ease.inOutCubic(c)
    const d = p <= tC ? 0 : Math.min((p - tC) / (1 - tC), 1)

    earthGroup.scale.setScalar(shrink)
    ;(top.material as THREE.ShaderMaterial).uniforms.uCrack.value = crack
    ;(bot.material as THREE.ShaderMaterial).uniforms.uCrack.value = crack
    ;(top.material as THREE.ShaderMaterial).uniforms.uSplit.value = split
    ;(bot.material as THREE.ShaderMaterial).uniforms.uSplit.value = split
    ;(core.material as THREE.ShaderMaterial).uniforms.uI.value = crack * 0.35 + c * 0.9
    camera.position.z = p <= tB ? homeZ() : dolly
    onFlash?.(ease.inQuad(d))
    markerFade = 1 - Math.min(crack * 1.4, 1)
  }

  let markerFade = 1

  // ---------- 主循环 ----------
  const clock = new THREE.Clock()
  const camDir = new THREE.Vector3()
  const wp = new THREE.Vector3()
  let raf = 0

  function tick() {
    const t = clock.getElapsedTime()
    ;(top.material as THREE.ShaderMaterial).uniforms.uTime.value = t
    ;(bot.material as THREE.ShaderMaterial).uniforms.uTime.value = t

    if (anim) {
      const dur = anim.dir === 1 ? TOTAL : TOTAL * 0.7
      const raw = Math.min((performance.now() - anim.t0) / dur, 1)
      const p = anim.dir === 1 ? raw : 1 - raw
      applyTransition(p)
      if (raw >= 1) {
        if (anim.dir === 1) onEnterCoreDone?.()
        else applyTransition(0)
        anim = null
        locked = false
      }
    } else if (focus) {
      const k = Math.min((performance.now() - focus.t0) / 700, 1)
      const e = ease.inOutCubic(k)
      rotY = focus.fromY + (focus.toY - focus.fromY) * e
      rotX = focus.fromX + (focus.toX - focus.fromX) * e
      if (k >= 1) focus = null
    } else if (!dragging) {
      velY *= 0.94
      rotY += spin + velY
    }

    earthGroup.rotation.y = rotY
    earthGroup.rotation.x = rotX

    // 背面标记淡出：只保留朝向镜头那一侧，避免"透视"到地球背面
    camera.getWorldPosition(camDir).normalize()
    for (const s of sprites) {
      s.getWorldPosition(wp).normalize()
      const facing = wp.dot(camDir)
      const vis = THREE.MathUtils.smoothstep(facing, 0.08, 0.42)
      s.material.opacity = vis * markerFade
      s.visible = s.material.opacity > 0.02
    }

    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  tick()

  function resize() {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
    if (!anim) camera.position.z = homeZ()
  }
  window.addEventListener('resize', resize)

  function destroy() {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    el.removeEventListener('mousedown', onDown)
    el.removeEventListener('touchstart', onDown)
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('touchmove', onMove)
    el.removeEventListener('mouseup', onUp)
    el.removeEventListener('touchend', onUp)
    renderer.dispose()
    if (el.parentNode === container) container.removeChild(el)
  }

  return {
    enterCore: () => startTransition(1),
    exitCore: () => startTransition(-1),
    /** 把指定经纬度转到正面 */
    focusCountry(lat: number, lon: number) {
      if (locked) return
      // 目标：该点法线朝 +Z。rotY 需要把 lon 转到正面
      const targetY = -((lon + 180) * Math.PI) / 180 - Math.PI / 2
      const targetX = THREE.MathUtils.clamp((lat * Math.PI) / 180, -0.85, 0.85)
      // 选与当前角度最近的等价角，避免绕远路
      let ty = targetY
      while (ty - rotY > Math.PI) ty -= Math.PI * 2
      while (ty - rotY < -Math.PI) ty += Math.PI * 2
      focus = { fromY: rotY, toY: ty, fromX: rotX, toX: targetX, t0: performance.now() }
      velY = 0
    },
    setNight(on: boolean) {
      ;(top.material as THREE.ShaderMaterial).uniforms.uNight.value = on ? 1 : 0
      ;(bot.material as THREE.ShaderMaterial).uniforms.uNight.value = on ? 1 : 0
    },
    destroy,
    textureState,
  }
}
