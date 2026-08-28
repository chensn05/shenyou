<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cultures, getCulture } from '../data/cultures'
import { charactersByCulture, type Character } from '../data/characters'
import { isCharacterUnlocked } from '../store/progress'
import { assetUrl } from '../utils/assetUrl'

const route = useRoute()
const router = useRouter()

const currentId = computed(() => String(route.params.culture || 'greek'))
const current = computed(() => getCulture(currentId.value) || cultures[0])
const currentChars = computed(() => charactersByCulture(currentId.value))
const artUrl = computed(() => assetUrl(`core-${currentId.value}.jpg`))

const activeChar = ref<Character | null>(null)

/* ---------- 人物热点 ---------- */
interface Marker extends Character {
  top: string
  left: string
  unlocked: boolean
}
const markers = computed<Marker[]>(() => {
  const layers = current.value.layers
  const n = layers.length
  const list: Marker[] = []
  layers.forEach((layer, li) => {
    const chars = currentChars.value.filter((c) => c.layer === layer.name)
    const topPct = 15 + ((li + 0.5) / n) * 75
    chars.forEach((c, ci) => {
      const spread = chars.length === 1 ? [50] : chars.map((_, i) => 22 + (i * 56) / (chars.length - 1))
      list.push({ ...c, top: `${topPct}%`, left: `${spread[ci]}%`, unlocked: isCharacterUnlocked(c.id) })
    })
  })
  return list
})

function switchCulture(id: string) {
  router.replace(`/core/${id}`)
}
function nameOf(id: string) {
  return currentChars.value.find((c) => c.id === id)?.name || id
}
function openChar(m: Marker) {
  if (!m.unlocked) return
  activeChar.value = m
}

/* ---------- 视差倾斜 ---------- */
const tiltEl = ref<HTMLDivElement | null>(null)
let raf = 0
let curRX = 0
let curRY = 0
let tgtRX = 0
let tgtRY = 0

function onPointerMove(e: PointerEvent) {
  const el = tiltEl.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
  const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
  tgtRY = nx * 7        // 左右转
  tgtRX = -ny * 5       // 上下转
}
function onPointerLeave() {
  tgtRX = 0
  tgtRY = 0
}
function tiltLoop() {
  curRX += (tgtRX - curRX) * 0.08
  curRY += (tgtRY - curRY) * 0.08
  if (tiltEl.value) {
    tiltEl.value.style.transform = `rotateX(${curRX.toFixed(2)}deg) rotateY(${curRY.toFixed(2)}deg) scale(1.04)`
  }
  raf = requestAnimationFrame(tiltLoop)
}

onMounted(() => {
  raf = requestAnimationFrame(tiltLoop)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerleave', onPointerLeave)
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerleave', onPointerLeave)
})
</script>

<template>
  <div class="corePage">
    <div class="topBar">
      <button class="back" @click="router.push('/map')">返回地表</button>
      <div class="header">地 心 · {{ current.label }}神话宇宙</div>
      <div class="tabs">
        <button
          v-for="c in cultures"
          :key="c.id"
          class="tab"
          :class="{ active: c.id === currentId }"
          @click="switchCulture(c.id)"
        >
          {{ c.label }}
        </button>
      </div>
    </div>

    <div class="stage">
      <div ref="tiltEl" class="tilt">
        <img :src="artUrl" class="art" :alt="`${current.label}神话宇宙分层图`" draggable="false" />
        <button
          v-for="m in markers"
          :key="m.id"
          class="marker"
          :class="{ locked: !m.unlocked }"
          :style="{ top: m.top, left: m.left }"
          @click="openChar(m)"
        >
          <span class="mFace">{{ m.unlocked ? m.emoji : '？' }}</span>
          <span class="mName">{{ m.unlocked ? m.name : '未解锁' }}</span>
        </button>
      </div>
    </div>

    <div class="hint">移动指针可轻微转动 · 点击人物查看详情</div>

    <transition name="fade">
      <div v-if="activeChar" class="modalMask" @click.self="activeChar = null">
        <div class="modal">
          <div class="modalHead">
            <span class="modalEmoji">{{ activeChar.emoji }}</span>
            <div>
              <div class="modalTitle">
                {{ activeChar.name }}
                <span v-if="activeChar.altName" class="altName">{{ activeChar.altName }}</span>
              </div>
              <div class="modalMeta">{{ activeChar.cultureLabel }} · {{ activeChar.layer }}</div>
            </div>
          </div>
          <div class="modalRow"><b>身份</b>{{ activeChar.identity }}</div>
          <div class="modalRow"><b>事迹</b>{{ activeChar.deeds }}</div>
          <div class="modalRow" v-if="activeChar.relations.length">
            <b>关系</b>
            <span v-for="(r, i) in activeChar.relations" :key="i" class="relTag">
              {{ nameOf(r.targetId) }}（{{ r.label }}）
            </span>
          </div>
          <div class="modalRow"><b>出处</b>{{ activeChar.source }}</div>
          <div class="modalRow versionNote" v-if="activeChar.versionNote">⚠️ {{ activeChar.versionNote }}</div>
          <button class="closeBtn" @click="activeChar = null">关闭</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.corePage {
  min-height: 100vh;
  background: #05070f;
  font-family: 'Songti SC', 'STSong', serif;
  color: #e8dcc0;
  overflow: hidden;
  position: relative;
}
.topBar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 12px 0 10px;
  background: linear-gradient(180deg, rgba(5, 7, 15, 0.88), transparent);
}
.back {
  display: block;
  margin: 0 auto 6px;
  padding: 8px 20px;
  border-radius: 17px;
  border: 1.2px solid rgba(201, 162, 39, 0.6);
  background: rgba(20, 24, 40, 0.6);
  color: #e8dcc0;
  font-size: 13px;
}
.header {
  text-align: center;
  font-size: 15px;
  letter-spacing: 3px;
  margin: 6px 0 10px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}
.tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 18px;
}
.tab {
  flex: none;
  padding: 6px 13px;
  border-radius: 13px;
  border: 1px solid rgba(201, 162, 39, 0.45);
  background: rgba(20, 24, 40, 0.55);
  color: #b8ac8e;
  font-size: 12px;
  white-space: nowrap;
}
.tab.active {
  background: linear-gradient(90deg, #c9a227, #e3c86b);
  color: #2a2010;
  border-color: #c9a227;
}

/* ---------- 视差舞台 ---------- */
.stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1100px;
  padding-top: 120px;
}
.tilt {
  position: relative;
  width: min(88vw, 460px);
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.05s linear;
}
.art {
  width: 100%;
  display: block;
  border-radius: 14px;
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(201, 162, 39, 0.18);
  user-select: none;
  -webkit-user-drag: none;
}
.marker {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  padding: 0;
  z-index: 5;
}
.mFace {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
  background: radial-gradient(circle at 35% 30%, #fff6dc, #e9ce86);
  border: 1.5px solid rgba(185, 154, 84, 0.9);
  box-shadow:
    0 3px 10px rgba(0, 0, 0, 0.5),
    0 0 0 4px rgba(255, 246, 214, 0.22);
  animation: bob 2.6s ease-in-out infinite;
}
.marker:not(.locked):hover .mFace {
  transform: scale(1.12);
}
.locked .mFace {
  background: radial-gradient(circle at 35% 30%, #6b6152, #453d30);
  color: #cfc2a4;
  border-color: rgba(92, 74, 50, 0.5);
  animation: none;
}
.mName {
  font-size: 10.5px;
  letter-spacing: 1px;
  color: #f5e9c8;
  background: rgba(20, 18, 12, 0.72);
  padding: 1px 7px;
  border-radius: 7px;
}
.locked .mName {
  color: #8a7c66;
}
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18px;
  text-align: center;
  font-size: 11px;
  color: rgba(232, 220, 192, 0.5);
  letter-spacing: 2px;
  pointer-events: none;
  z-index: 5;
}

/* ---------- 弹窗 ---------- */
.modalMask {
  position: fixed;
  inset: 0;
  background: rgba(10, 8, 14, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  padding: 24px;
}
.modal {
  width: 100%;
  max-width: 360px;
  background: #fdf6e6;
  border: 1px solid #c4a971;
  border-radius: 14px;
  padding: 20px 20px 16px;
  color: #4a3b28;
}
.modalHead {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}
.modalEmoji {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: radial-gradient(circle at 35% 30%, #fff6dc, #e9ce86);
  border: 1.5px solid rgba(185, 154, 84, 0.85);
}
.modalTitle {
  font-size: 17px;
  letter-spacing: 2px;
}
.altName {
  font-size: 11px;
  color: #9c8a6c;
  margin-left: 6px;
}
.modalMeta {
  font-size: 11px;
  color: #8a7658;
  margin-top: 3px;
}
.modalRow {
  font-size: 13px;
  line-height: 1.8;
  margin-bottom: 8px;
}
.modalRow b {
  display: inline-block;
  width: 44px;
  color: #a9752c;
  font-weight: normal;
}
.relTag {
  display: inline-block;
  font-size: 11.5px;
  background: rgba(201, 162, 39, 0.15);
  border-radius: 8px;
  padding: 1px 8px;
  margin: 2px 4px 0 0;
}
.versionNote {
  color: #8a5a2c;
  font-size: 11.5px;
}
.closeBtn {
  width: 100%;
  height: 38px;
  border-radius: 19px;
  border: 1px solid #c4a971;
  background: transparent;
  color: #5c4a32;
  margin-top: 8px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
