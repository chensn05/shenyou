// 极简学习进度 store：完成的故事 + 已解锁的人物，存 localStorage
import { reactive, computed } from 'vue'
import { stories } from '../data/stories'

const STORAGE_KEY = 'myth-planet-progress-v1'

interface ProgressState {
  completedStoryIds: string[]
  unlockedCharacterIds: string[]
  completedHistoryIds: string[]
}

function load(): ProgressState {
  // 展开默认值兜底：老用户的存档里没有后来新增的字段，直接 return JSON.parse 会崩
  const def: ProgressState = { completedStoryIds: [], unlockedCharacterIds: [], completedHistoryIds: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...def, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return def
}

const state = reactive<ProgressState>(load())

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

export function completeStory(id: string, relatedCharacterIds: string[] = []) {
  if (!state.completedStoryIds.includes(id)) state.completedStoryIds.push(id)
  relatedCharacterIds.forEach((cid) => {
    if (!state.unlockedCharacterIds.includes(cid)) state.unlockedCharacterIds.push(cid)
  })
  persist()
}

export function isStoryComplete(id: string) {
  return state.completedStoryIds.includes(id)
}

/** 历史长河完成度（与神话分开统计） */
export function completeHistory(id: string) {
  if (!state.completedHistoryIds.includes(id)) {
    state.completedHistoryIds.push(id)
    persist()
  }
}

export function isHistoryComplete(id: string) {
  return state.completedHistoryIds.includes(id)
}

export const historyProgress = computed(() => state.completedHistoryIds.length)

export function isCharacterUnlocked(id: string) {
  return state.unlockedCharacterIds.includes(id)
}

export const totalProgress = computed(() => {
  const readyCount = stories.filter((s) => s.status === 'ready').length
  if (readyCount === 0) return 0
  return Math.round((state.completedStoryIds.length / readyCount) * 100)
})

export const progressState = state
