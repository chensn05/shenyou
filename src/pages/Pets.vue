<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PixelSprite from '../components/PixelSprite.vue'
import { spriteFor, spriteForBreed, getBreed } from '../data/pixelArt'
import {
  companions,
  allCompanions,
  activeCompanion,
  petState,
  isUnlocked,
  stageIndexOf,
  stageProgress,
  selectCompanion,
  feed,
  pat,
  type Companion,
} from '../store/pet'
import { progressState } from '../store/progress'

const router = useRouter()
const toast = ref('')
const pulse = ref(0)
let toastTimer: number | undefined

function showToast(msg: string) {
  toast.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 1800)
}

const mythCompanions = companions
const breedCompanions = computed(() => allCompanions.filter((c) => getBreed(c.id)))

const stageIdx = computed(() => stageIndexOf(activeCompanion.value.id))
const stage = computed(() => activeCompanion.value.stages[stageIdx.value])
const progress = computed(() => stageProgress(activeCompanion.value.id))
const isMax = computed(() => progress.value.max)
const readCount = computed(() => progressState.completedStoryIds.length)

/** 品种用缩放表现成长；神话伙伴有独立阶段图 */
const BREED_SCALES = [0.7, 0.85, 1, 1]
const activeIsBreed = computed(() => !!getBreed(activeCompanion.value.id))
const activeScale = computed(() => (activeIsBreed.value ? BREED_SCALES[stageIdx.value] : 1))
const activeAura = computed(() => (activeIsBreed.value ? stageIdx.value >= 3 : isMax.value))

function spriteOf(c: Companion) {
  const b = getBreed(c.id)
  if (b) return spriteForBreed(c.id)
  return spriteFor(c.id, stageIndexOf(c.id))
}

function onFeed() {
  const r = feed()
  if (!r.ok) return showToast(r.reason || '喂养失败')
  pulse.value++
  showToast(r.leveledTo !== undefined ? `${activeCompanion.value.name} 成长了一个阶段！` : '养分 -10，经验 +12')
}

function onPat() {
  const r = pat()
  if (!r.ok) return showToast(r.reason || '')
  pulse.value++
  showToast(r.leveledTo !== undefined ? `${activeCompanion.value.name} 成长了一个阶段！` : '摸摸头，经验 +2')
}

function pick(c: Companion) {
  if (!isUnlocked(c)) {
    showToast(c.unlockHint || '尚未解锁')
    return
  }
  selectCompanion(c.id)
}

function rarityClass(c: Companion) {
  return `rarity-${c.rarity || 'M'}`
}
</script>

<template>
  <div class="page">
    <button class="back" @click="router.push('/map')">← 返回</button>
    <div class="title">我 的 伙 伴</div>

    <div class="nutrients">
      🌰 养分 <b>{{ petState.nutrients }}</b>
      <span class="hint">读完故事 +10 · 答对一题 +5 · 已读 {{ readCount }} 篇</span>
    </div>

    <div class="stage">
      <PixelSprite
        :sprite="spriteOf(activeCompanion)"
        :size="150"
        :scale="activeScale"
        :aura="activeAura"
        :pulse="pulse"
      />
      <div class="petName">
        {{ activeCompanion.name }}
        <span class="rarityTag" :class="rarityClass(activeCompanion)">{{ activeCompanion.rarity || 'M' }}</span>
      </div>
      <div class="petStage">{{ stage.label }}（{{ stageIdx + 1 }} / {{ activeCompanion.stages.length }}）</div>
      <div class="petDesc">{{ activeCompanion.desc }}</div>

      <div class="expBar">
        <div class="expFill" :style="{ width: (isMax ? 100 : progress.ratio * 100) + '%' }"></div>
      </div>
      <div class="expTxt">{{ isMax ? '已达最终形态' : `还差 ${progress.need} 经验进阶` }}</div>

      <div class="actions">
        <button class="actBtn feed" @click="onFeed">喂养 · 养分-10</button>
        <button class="actBtn pat" @click="onPat">抚摸 · 免费</button>
      </div>
    </div>

    <div class="listTitle">神话伙伴 <span class="sub">完成对应神话解锁</span></div>
    <div class="grid">
      <button
        v-for="c in mythCompanions"
        :key="c.id"
        class="card"
        :class="{ active: c.id === activeCompanion.id, locked: !isUnlocked(c) }"
        @click="pick(c)"
      >
        <PixelSprite v-if="isUnlocked(c)" :sprite="spriteFor(c.id, stageIndexOf(c.id))" :size="56" />
        <span v-else class="lockIcon">?</span>
        <span class="cName">{{ isUnlocked(c) ? c.name : '？？？' }}</span>
        <span class="cSub">{{ isUnlocked(c) ? c.stages[stageIndexOf(c.id)].label : c.unlockHint }}</span>
      </button>
    </div>

    <div class="listTitle">萌宠图鉴 <span class="sub">N 直接选 · R 读满 5 篇 · SR 读满 12 篇</span></div>
    <div class="grid">
      <button
        v-for="c in breedCompanions"
        :key="c.id"
        class="card"
        :class="[rarityClass(c), { active: c.id === activeCompanion.id, locked: !isUnlocked(c) }]"
        @click="pick(c)"
      >
        <PixelSprite v-if="isUnlocked(c)" :sprite="spriteOf(c)" :size="56" />
        <span v-else class="lockIcon">?</span>
        <span class="cName">{{ isUnlocked(c) ? c.name : '？？？' }}</span>
        <span class="cSub" v-if="!isUnlocked(c)">{{ c.unlockHint }}</span>
        <span class="cSub" v-else>{{ c.stages[stageIndexOf(c.id)].label }}</span>
        <span class="rarityDot" :class="rarityClass(c)"></span>
      </button>
    </div>

    <transition name="fade">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </transition>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f3eada;
  padding: 20px 22px 60px;
  font-family: 'Songti SC', 'STSong', serif;
  color: #4a3b28;
}
.back { background: none; border: none; color: #8a7658; font-size: 13px; margin-bottom: 14px; }
.title { text-align: center; font-size: 18px; letter-spacing: 4px; margin-bottom: 10px; }

.nutrients { text-align: center; font-size: 14px; color: #6d5b3e; margin-bottom: 16px; }
.nutrients b { color: #a9752c; font-size: 16px; }
.hint { display: block; font-size: 11px; color: #9c8a6c; margin-top: 3px; }

.stage {
  display: flex; flex-direction: column; align-items: center;
  padding: 22px 20px 20px; border-radius: 16px;
  background: rgba(255,255,255,0.55); border: 1px solid #e0d3b6;
  margin-bottom: 22px;
}
.petName { font-size: 17px; letter-spacing: 2px; margin-top: 10px; display: flex; align-items: center; gap: 8px; }
.petStage { font-size: 12px; color: #8a7658; margin-top: 3px; }
.petDesc { font-size: 12px; color: #7a6a4e; margin-top: 8px; text-align: center; line-height: 1.7; }

.expBar { width: 100%; height: 8px; margin-top: 14px; border-radius: 4px; background: #e6dac0; overflow: hidden; }
.expFill { height: 100%; background: linear-gradient(90deg, #c9a227, #e3c86b); transition: width 0.3s ease; }
.expTxt { font-size: 11px; color: #9c8a6c; margin-top: 5px; }

.actions { display: flex; gap: 10px; margin-top: 16px; width: 100%; }
.actBtn { flex: 1; height: 40px; border-radius: 20px; font-size: 13px; letter-spacing: 1px; border: none; }
.actBtn.feed { background: linear-gradient(90deg, #c9a227, #e3c86b); color: #4a3b28; }
.actBtn.pat { background: #fff; border: 1px solid #c4a971; color: #5c4a32; }

.listTitle { font-size: 13px; letter-spacing: 2px; color: #8a7658; margin: 20px 0 10px; }
.listTitle .sub { font-size: 10.5px; letter-spacing: 0; color: #b0a284; margin-left: 6px; }

.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.card {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 10px 6px; border-radius: 12px; border: 1px solid #e0d3b6;
  background: rgba(255,255,255,0.5);
}
.card.active { border-color: #c9a227; background: rgba(201,162,39,0.12); }
.card.locked { opacity: 0.55; }
.cName { font-size: 11.5px; margin-top: 2px; }
.cSub { font-size: 9px; color: #9c8a6c; text-align: center; line-height: 1.3; min-height: 12px; }
.lockIcon {
  width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: #b9a888;
}

.rarityTag { font-size: 10px; padding: 1px 8px; border-radius: 8px; letter-spacing: 1px; }
.rarity-M { background: rgba(201,162,39,0.2); color: #a9752c; }
.rarity-N { background: #eee6d4; color: #8a7658; }
.rarity-R { background: rgba(111,168,90,0.18); color: #4a6a3a; }
.rarity-SR { background: rgba(169,87,42,0.16); color: #a9572a; }
.rarityDot {
  position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%;
}
.rarityDot.rarity-N { background: #c9bfa8; }
.rarityDot.rarity-R { background: #6fa85a; }
.rarityDot.rarity-SR { background: #d9762c; }

.toast {
  position: fixed; left: 50%; bottom: 34px; transform: translateX(-50%);
  background: rgba(74,59,40,0.9); color: #fdf6e6; font-size: 13px;
  padding: 10px 18px; border-radius: 20px; z-index: 9; white-space: nowrap;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
