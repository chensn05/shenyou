<script setup lang="ts">
// 像素精灵渲染：按 16×16 点阵逐格填色，天然锐利，无缩放糊化。
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { SpriteDef } from '../data/pixelArt'

const props = withDefaults(
  defineProps<{
    sprite: SpriteDef
    /** 显示边长 css px */
    size?: number
    /** 金色光环（完全体） */
    aura?: boolean
    /** 成长缩放（萌宠阶段用） */
    scale?: number
    /** 每次自增触发一次弹跳 + 粒子 */
    pulse?: number
  }>(),
  { size: 96, aura: false, scale: 1, pulse: 0 },
)

const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let bounceStart = -1
const particles: { x: number; y: number; vx: number; vy: number; life: number }[] = []

function draw(now: number) {
  const cv = canvas.value
  if (!cv) return
  const dpr = Math.min(devicePixelRatio, 2)
  const S = props.size
  if (cv.width !== S * dpr) {
    cv.width = S * dpr
    cv.height = S * dpr
  }
  const g = cv.getContext('2d')!
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, S, S)

  const rows = props.sprite.rows
  const N = rows.length            // 16
  const cell = S / N               // 每个像素格边长
  const palette = props.sprite.palette

  // 弹跳
  let dy = 0
  let scale = props.scale
  if (bounceStart >= 0) {
    const t = (now - bounceStart) / 480
    if (t >= 1) bounceStart = -1
    else {
      const k = Math.sin(t * Math.PI)
      dy = -k * S * 0.1
      scale = props.scale * (1 + k * 0.08)
    }
  }

  // 光环
  if (props.aura) {
    const r = S * 0.44 + Math.sin(now / 420) * S * 0.012
    const rg = g.createRadialGradient(S / 2, S / 2, r * 0.5, S / 2, S / 2, r)
    rg.addColorStop(0, 'rgba(255,236,170,0)')
    rg.addColorStop(0.68, 'rgba(228,183,74,0.34)')
    rg.addColorStop(1, 'rgba(228,183,74,0)')
    g.fillStyle = rg
    g.beginPath()
    g.arc(S / 2, S / 2, r, 0, Math.PI * 2)
    g.fill()
  }

  // 点阵主体
  g.save()
  g.translate(S / 2, S / 2 + dy)
  g.scale(scale, scale)
  g.translate(-S / 2, -S / 2)
  for (let y = 0; y < N; y++) {
    const row = rows[y]
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      if (ch === '.') continue
      const color = palette[ch]
      if (!color) continue
      g.fillStyle = color
      // +0.5 消除相邻格之间的亚像素缝隙
      g.fillRect(x * cell, y * cell, cell + 0.5, cell + 0.5)
    }
  }
  g.restore()

  // 粒子（像素方块）
  const px = Math.max(2, Math.round(cell))
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.045
    p.life -= 0.02
    if (p.life <= 0) {
      particles.splice(i, 1)
      continue
    }
    g.globalAlpha = Math.max(0, p.life)
    g.fillStyle = '#E4B74A'
    g.fillRect(Math.round(p.x), Math.round(p.y), px, px)
    g.globalAlpha = 1
  }

  raf = requestAnimationFrame(draw)
}

function burst() {
  bounceStart = performance.now()
  const S = props.size
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.4
    particles.push({
      x: S / 2,
      y: S * 0.5,
      vx: Math.cos(a) * (0.9 + Math.random() * 0.8),
      vy: Math.sin(a) * (0.9 + Math.random() * 0.8) - 0.8,
      life: 1,
    })
  }
}

watch(
  () => props.pulse,
  (v, old) => {
    if (v !== old && v > 0) burst()
  },
)

onMounted(() => {
  raf = requestAnimationFrame(draw)
})
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <canvas ref="canvas" :style="{ width: size + 'px', height: size + 'px' }"></canvas>
</template>
