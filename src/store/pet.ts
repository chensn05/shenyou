// 神游 · 电子宠物 / 植物养成
//
// 养分只能从学习里赚：读完一篇故事 +10，每答对一题 +5（单篇最多 25）。
// 伙伴通过完成对应神话解锁，把养成和内容闭环接起来。

import { reactive, computed } from 'vue'
import { progressState } from './progress'
import { PET_BREEDS } from '../data/pixelArt'

const KEY = 'myth-planet-pet-v1'

export interface Stage {
  emoji: string
  label: string
}

export interface Companion {
  id: string
  name: string
  kind: 'plant' | 'animal'
  desc: string
  /** 解锁所需完成的故事 id */
  unlockStoryId?: string
  /** 阅读篇数达标解锁（萌宠品种用） */
  unlockProgress?: number
  unlockHint?: string
  /** 稀有度：神话伙伴恒为 M；品种为 N/R/SR */
  rarity?: 'M' | 'N' | 'R' | 'SR'
  stages: Stage[]
}

/** 品种伙伴的统一成长阶段（同一精灵，靠缩放 + 光环表现成长） */
const BREED_STAGES: Stage[] = [
  { emoji: '', label: '幼年' },
  { emoji: '', label: '成长' },
  { emoji: '', label: '成年' },
  { emoji: '', label: '完全体' },
]

/** 萌宠品种 → 伙伴 */
const breedCompanions: Companion[] = PET_BREEDS.map((b) => ({
  id: b.id,
  name: b.name,
  kind: 'animal' as const,
  desc: `${b.kind === 'cat' ? '猫' : '狗'} · ${b.rarity} 级`,
  unlockProgress: b.unlockProgress,
  unlockHint: b.unlockProgress ? `读满 ${b.unlockProgress} 篇神话后解锁` : undefined,
  rarity: b.rarity,
  stages: BREED_STAGES,
}))

export const companions: Companion[] = [
  {
    id: 'xingya',
    name: '星芽',
    kind: 'plant',
    desc: '初始伙伴。据说是从星屑里落下来的种子。',
    stages: [
      { emoji: '🌰', label: '种子' },
      { emoji: '🌱', label: '嫩芽' },
      { emoji: '🌿', label: '舒展' },
      { emoji: '🌸', label: '绽放' },
    ],
  },
  {
    id: 'jingwei',
    name: '精卫',
    kind: 'animal',
    desc: '文首、白喙、赤足的小鸟，衔石不止。',
    unlockStoryId: 'jingwei',
    unlockHint: '完成《精卫填海》后解锁',
    stages: [
      { emoji: '🥚', label: '卵' },
      { emoji: '🐣', label: '雏鸟' },
      { emoji: '🐦', label: '振翅' },
      { emoji: '🦅', label: '衔石' },
    ],
  },
  {
    id: 'inaba',
    name: '白兔',
    kind: 'animal',
    desc: '因幡海边那只被蒲黄花粉治好的白兔。',
    unlockStoryId: 'inaba',
    unlockHint: '完成《因幡白兔》后解锁',
    stages: [
      { emoji: '🌾', label: '草丛' },
      { emoji: '🐇', label: '幼兔' },
      { emoji: '🐰', label: '白兔' },
      { emoji: '🐰', label: '痊愈' },
    ],
  },
  {
    id: 'fenrir',
    name: '幼狼',
    kind: 'animal',
    desc: '被锁链缚住的巨狼，在预言里终将挣脱。',
    unlockStoryId: 'ragnarok',
    unlockHint: '完成《诸神黄昏》后解锁',
    stages: [
      { emoji: '🐾', label: '足迹' },
      { emoji: '🐕', label: '幼狼' },
      { emoji: '🐺', label: '成狼' },
      { emoji: '🐺', label: '挣脱' },
    ],
  },
]

/** 全部伙伴 = 神话伙伴 + 萌宠品种 */
export const allCompanions: Companion[] = [...companions, ...breedCompanions]

/** 各阶段所需累计经验 */
export const STAGE_EXP = [0, 40, 100, 200]
export const FEED_COST = 10
export const FEED_EXP = 12
export const PAT_EXP = 2
export const PAT_COOLDOWN_MS = 20_000

interface PetState {
  nutrients: number
  activeId: string
  exp: Record<string, number>
  lastPatAt: number
}

function load(): PetState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { nutrients: 20, activeId: 'xingya', exp: {}, lastPatAt: 0, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { nutrients: 20, activeId: 'xingya', exp: {}, lastPatAt: 0 }
}

const state = reactive<PetState>(load())

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

export const petState = state

export function isUnlocked(c: Companion) {
  if (c.unlockStoryId) return progressState.completedStoryIds.includes(c.unlockStoryId)
  if (c.unlockProgress) return progressState.completedStoryIds.length >= c.unlockProgress
  return true
}

export const unlockedCompanions = computed(() => allCompanions.filter(isUnlocked))

export const activeCompanion = computed(
  () => allCompanions.find((c) => c.id === state.activeId) || allCompanions[0],
)

export function expOf(id: string) {
  return state.exp[id] || 0
}

export function stageIndexOf(id: string) {
  const e = expOf(id)
  let idx = 0
  for (let i = 0; i < STAGE_EXP.length; i++) if (e >= STAGE_EXP[i]) idx = i
  return idx
}

/** 当前阶段进度 0~1，以及距下一阶段还差多少 */
export function stageProgress(id: string) {
  const e = expOf(id)
  const idx = stageIndexOf(id)
  if (idx >= STAGE_EXP.length - 1) return { ratio: 1, need: 0, max: true }
  const from = STAGE_EXP[idx]
  const to = STAGE_EXP[idx + 1]
  return { ratio: (e - from) / (to - from), need: to - e, max: false }
}

export function selectCompanion(id: string) {
  const c = allCompanions.find((x) => x.id === id)
  if (!c || !isUnlocked(c)) return false
  state.activeId = id
  persist()
  return true
}

/** 喂养：消耗养分换经验。返回是否成功 + 是否升阶 */
export function feed(): { ok: boolean; leveledTo?: number; reason?: string } {
  if (state.nutrients < FEED_COST) return { ok: false, reason: '养分不够，去读一篇神话吧' }
  const id = state.activeId
  const before = stageIndexOf(id)
  state.nutrients -= FEED_COST
  state.exp[id] = expOf(id) + FEED_EXP
  const after = stageIndexOf(id)
  persist()
  return { ok: true, leveledTo: after > before ? after : undefined }
}

/** 抚摸：免费但有冷却 */
export function pat(): { ok: boolean; leveledTo?: number; reason?: string } {
  const now = Date.now()
  const left = PAT_COOLDOWN_MS - (now - state.lastPatAt)
  if (left > 0) return { ok: false, reason: `休息一下，${Math.ceil(left / 1000)} 秒后再来` }
  const id = state.activeId
  const before = stageIndexOf(id)
  state.lastPatAt = now
  state.exp[id] = expOf(id) + PAT_EXP
  const after = stageIndexOf(id)
  persist()
  return { ok: true, leveledTo: after > before ? after : undefined }
}

/** 学习产出养分：读完 +10，每答对一题 +5 */
export function awardForStory(correctCount: number) {
  const gained = 10 + correctCount * 5
  state.nutrients += gained
  persist()
  return gained
}
