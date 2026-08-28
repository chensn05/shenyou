<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { catalogStories, catalogCountries } from '../data/catalog'
import { characters, type Character } from '../data/characters'
import { isStoryComplete, isCharacterUnlocked } from '../store/progress'

const router = useRouter()
const tab = ref<'story' | 'char'>('story')
const search = ref('')
const filterCountry = ref<string>('')
const activeChar = ref<Character | null>(null)

/* ---------- 故事 ---------- */
const storyRows = computed(() => {
  const q = search.value.trim().toLowerCase()
  return catalogStories
    .map((s) => {
      const c = catalogCountries.find((x) => x.id === s.countryId)!
      return {
        ...s,
        countryName: c.name,
        countryEn: c.enName,
        read: s.status === 'ready' && !!s.storyId && isStoryComplete(s.storyId),
      }
    })
    .filter((s) => {
      if (filterCountry.value && s.countryId !== filterCountry.value) return false
      if (!q) return true
      return (
        s.title.toLowerCase().includes(q) ||
        s.countryName.includes(q) ||
        s.countryEn.toLowerCase().includes(q) ||
        s.source.toLowerCase().includes(q)
      )
    })
})

const storyStats = computed(() => {
  const ready = catalogStories.filter((s) => s.status === 'ready')
  const read = ready.filter((s) => s.storyId && isStoryComplete(s.storyId)).length
  return { read, ready: ready.length, total: catalogStories.length }
})

/* ---------- 人物 ---------- */
const charRows = computed(() => {
  const q = search.value.trim().toLowerCase()
  return characters
    .map((c) => ({ ...c, unlocked: isCharacterUnlocked(c.id) }))
    .filter((c) => {
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        (c.altName || '').toLowerCase().includes(q) ||
        c.cultureLabel.includes(q) ||
        c.layer.includes(q)
      )
    })
})

const charStats = computed(() => {
  const unlocked = characters.filter((c) => isCharacterUnlocked(c.id)).length
  return { unlocked, total: characters.length }
})

/* 按文化圈分组人物 */
const charGroups = computed(() => {
  const map = new Map<string, typeof charRows.value>()
  charRows.value.forEach((c) => {
    if (!map.has(c.cultureLabel)) map.set(c.cultureLabel, [])
    map.get(c.cultureLabel)!.push(c)
  })
  return [...map.entries()]
})

function openStory(s: (typeof storyRows.value)[number]) {
  if (s.status === 'ready' && s.storyId) router.push(`/story/${s.storyId}`)
}
function openChar(c: Character & { unlocked: boolean }) {
  if (!c.unlocked) return
  activeChar.value = c
}
function nameOf(id: string) {
  return characters.find((c) => c.id === id)?.name || id
}
</script>

<template>
  <div class="page">
    <button class="back" @click="router.push('/map')">← 返回</button>
    <div class="title">神 话 图 鉴</div>

    <!-- 收集进度 -->
    <div class="stats">
      <div class="statCard">
        <div class="statNum">{{ storyStats.read }} <span>/ {{ storyStats.ready }}</span></div>
        <div class="statLabel">故事已读</div>
        <div class="statBar"><div :style="{ width: (storyStats.read / storyStats.ready) * 100 + '%' }"></div></div>
      </div>
      <div class="statCard">
        <div class="statNum">{{ charStats.unlocked }} <span>/ {{ charStats.total }}</span></div>
        <div class="statLabel">人物已解锁</div>
        <div class="statBar"><div :style="{ width: (charStats.unlocked / charStats.total) * 100 + '%' }"></div></div>
      </div>
    </div>

    <!-- 双栏切换 -->
    <div class="tabs">
      <button class="tab" :class="{ active: tab === 'story' }" @click="tab = 'story'">
        故事 {{ storyStats.total }}
      </button>
      <button class="tab" :class="{ active: tab === 'char' }" @click="tab = 'char'">
        人物 {{ charStats.total }}
      </button>
    </div>

    <input v-model="search" class="searchBox" placeholder="搜索标题 / 国家 / 文献 / 人物…" />

    <!-- 故事栏 -->
    <template v-if="tab === 'story'">
      <div class="countryFilter">
        <button class="cf" :class="{ on: !filterCountry }" @click="filterCountry = ''">全部</button>
        <button
          v-for="c in catalogCountries"
          :key="c.id"
          class="cf"
          :class="{ on: filterCountry === c.id }"
          @click="filterCountry = c.id"
        >
          {{ c.name }}
        </button>
      </div>

      <div class="list">
        <button
          v-for="s in storyRows"
          :key="s.countryId + s.title"
          class="item"
          :class="{ dim: s.status !== 'ready' }"
          @click="openStory(s)"
        >
          <span class="iEmoji">{{ s.emoji }}</span>
          <span class="iBody">
            <span class="iTitle">{{ s.title }}</span>
            <span class="iMeta">{{ s.countryName }} · {{ s.source }}</span>
          </span>
          <span v-if="s.status !== 'ready'" class="badge planned">待撰写</span>
          <span v-else-if="s.read" class="badge done">已读</span>
          <span v-else class="badge">未读</span>
        </button>
        <div v-if="!storyRows.length" class="noResult">没有匹配的故事</div>
      </div>
    </template>

    <!-- 人物栏 -->
    <template v-else>
      <div v-for="[culture, list] in charGroups" :key="culture" class="charGroup">
        <div class="groupTitle">{{ culture }}</div>
        <div class="charGrid">
          <button
            v-for="c in list"
            :key="c.id"
            class="charCard"
            :class="{ locked: !c.unlocked }"
            @click="openChar(c)"
          >
            <span class="cFace">{{ c.unlocked ? c.emoji : '？' }}</span>
            <span class="cName">{{ c.unlocked ? c.name : '未解锁' }}</span>
            <span class="cLayer">{{ c.unlocked ? c.layer : '完成相关故事' }}</span>
          </button>
        </div>
      </div>
      <div v-if="!charRows.length" class="noResult">没有匹配的人物</div>
    </template>

    <!-- 人物详情 -->
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
          <div class="modalRow" v-if="activeChar.relatedStoryIds.length">
            <b>相关</b>
            <button
              v-for="sid in activeChar.relatedStoryIds"
              :key="sid"
              class="jumpBtn"
              @click="router.push(`/story/${sid}`)"
            >
              去读故事 →
            </button>
          </div>
          <button class="closeBtn" @click="activeChar = null">关闭</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f3eada;
  padding: 20px 20px 60px;
  font-family: 'Songti SC', 'STSong', serif;
  color: #4a3b28;
}
.back { background: none; border: none; color: #8a7658; font-size: 13px; margin-bottom: 12px; }
.title { text-align: center; font-size: 18px; letter-spacing: 4px; margin-bottom: 16px; }

/* 进度 */
.stats { display: flex; gap: 12px; margin-bottom: 16px; }
.statCard {
  flex: 1; padding: 12px 14px; border-radius: 12px;
  background: rgba(255, 255, 255, 0.55); border: 1px solid #e0d3b6;
}
.statNum { font-size: 20px; color: #a9752c; }
.statNum span { font-size: 12px; color: #9c8a6c; }
.statLabel { font-size: 11px; color: #8a7658; margin-top: 2px; }
.statBar { height: 4px; background: #e6dac0; border-radius: 2px; margin-top: 8px; overflow: hidden; }
.statBar div { height: 100%; background: linear-gradient(90deg, #c9a227, #e3c86b); transition: width 0.4s ease; }

/* 双栏 */
.tabs { display: flex; gap: 10px; margin-bottom: 12px; }
.tab {
  flex: 1; height: 38px; border-radius: 19px; font-size: 13.5px; letter-spacing: 1px;
  border: 1px solid #c4a971; background: rgba(253, 248, 238, 0.7); color: #7a6a4e;
}
.tab.active { background: linear-gradient(90deg, #c9a227, #e3c86b); color: #4a3b28; border-color: #a9752c; }

.searchBox {
  width: 100%; height: 36px; padding: 0 12px; margin-bottom: 12px;
  border-radius: 10px; border: 1px solid #d9c79a; background: #fffdf7;
  font-size: 13px; color: #4a3b28; font-family: inherit;
}

/* 国家筛选 */
.countryFilter {
  display: flex; gap: 6px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 6px;
}
.cf {
  flex: none; padding: 5px 11px; border-radius: 12px; font-size: 11.5px; white-space: nowrap;
  border: 1px solid #d9c79a; background: rgba(253, 248, 238, 0.6); color: #7a6a4e;
}
.cf.on { background: #c9a227; color: #fff8e6; border-color: #a9752c; }

/* 故事列表 */
.list { display: flex; flex-direction: column; gap: 8px; }
.item {
  display: flex; align-items: center; gap: 11px; width: 100%;
  padding: 11px 13px; border-radius: 12px; text-align: left;
  border: 1px solid #e0d3b6; background: rgba(255, 255, 255, 0.6);
}
.item.dim { opacity: 0.62; }
.iEmoji { font-size: 20px; flex: none; }
.iBody { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.iTitle { font-size: 14px; }
.iMeta {
  font-size: 10.5px; color: #97835f; margin-top: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.badge {
  flex: none; font-size: 10.5px; padding: 3px 9px; border-radius: 10px;
  border: 1px solid #c4a971; color: #7a6a4e;
}
.badge.done { background: #e2ecd8; border-color: #6a8a5a; color: #4a6a3a; }
.badge.planned { background: #eee6d4; color: #9c8a6c; border-color: #ddd0b4; }
.noResult { text-align: center; font-size: 12.5px; color: #a3927a; padding: 26px 0; }

/* 人物 */
.charGroup { margin-bottom: 20px; }
.groupTitle {
  font-size: 12px; letter-spacing: 2px; color: #8a7658;
  padding-bottom: 6px; margin-bottom: 10px; border-bottom: 1px dashed #d9c79a;
}
.charGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.charCard {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 12px 6px; border-radius: 12px;
  border: 1px solid #e0d3b6; background: rgba(255, 255, 255, 0.6);
}
.charCard.locked { opacity: 0.55; }
.cFace {
  width: 46px; height: 46px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 22px;
  background: radial-gradient(circle at 35% 30%, #fff6dc, #e9ce86);
  border: 1.5px solid rgba(185, 154, 84, 0.8);
}
.locked .cFace { background: radial-gradient(circle at 35% 30%, #8a7c66, #5c4f3e); color: #d9cba8; }
.cName { font-size: 12px; }
.cLayer { font-size: 9.5px; color: #9c8a6c; text-align: center; line-height: 1.3; }

/* 弹窗 */
.modalMask {
  position: fixed; inset: 0; background: rgba(40, 30, 18, 0.45);
  display: flex; align-items: center; justify-content: center; z-index: 30; padding: 24px;
}
.modal {
  width: 100%; max-width: 360px; background: #fdf6e6;
  border: 1px solid #c4a971; border-radius: 14px; padding: 20px 20px 16px;
  max-height: 80vh; overflow-y: auto;
}
.modalHead { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; }
.modalEmoji {
  width: 48px; height: 48px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 24px;
  background: radial-gradient(circle at 35% 30%, #fff6dc, #e9ce86);
  border: 1.5px solid rgba(185, 154, 84, 0.85);
}
.modalTitle { font-size: 17px; letter-spacing: 2px; }
.altName { font-size: 11px; color: #9c8a6c; margin-left: 6px; }
.modalMeta { font-size: 11px; color: #8a7658; margin-top: 3px; }
.modalRow { font-size: 13px; line-height: 1.8; margin-bottom: 8px; }
.modalRow b { display: inline-block; width: 44px; color: #a9752c; font-weight: normal; }
.relTag {
  display: inline-block; font-size: 11.5px; background: rgba(201, 162, 39, 0.15);
  border-radius: 8px; padding: 1px 8px; margin: 2px 4px 0 0;
}
.versionNote { color: #8a5a2c; font-size: 11.5px; }
.jumpBtn {
  font-size: 12px; color: #a9752c; background: none; border: none;
  text-decoration: underline; padding: 0 4px;
}
.closeBtn {
  width: 100%; height: 38px; border-radius: 19px;
  border: 1px solid #c4a971; background: transparent; color: #5c4a32; margin-top: 8px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
