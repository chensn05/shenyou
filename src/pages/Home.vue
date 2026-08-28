<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createEarthScene, type StoryMarker } from '../three/earthScene'
import {
  catalogCountries,
  catalogStories,
  countryStats,
  storiesOfCountry,
  totalCountryCount,
  totalStoryCount,
  readyStoryCount,
  type CatalogStory,
} from '../data/catalog'
import { totalProgress } from '../store/progress'

const router = useRouter()
const canvasWrap = ref<HTMLDivElement | null>(null)
const flashOpacity = ref(0)
const night = ref(false)
// 侧栏默认收起（可展开）；记住用户偏好
const sidebarOpen = ref(localStorage.getItem('myth-planet-sidebar') === '1')
const search = ref('')
const activeCountry = ref<string | null>(null)
const hoverMarker = ref<StoryMarker | null>(null)
const hoverPos = ref({ x: 0, y: 0 })
const sheet = ref<StoryMarker | null>(null)
const panelCountry = ref<string | null>(null)
let scene: ReturnType<typeof createEarthScene> | null = null

const stats = countryStats()

const markers: StoryMarker[] = catalogStories.map((s) => {
  const c = catalogCountries.find((x) => x.id === s.countryId)!
  return {
    key: `${s.countryId}-${s.title}`,
    emoji: s.emoji,
    title: s.title,
    countryId: s.countryId,
    countryName: c.name,
    lat: c.lat,
    lon: c.lon,
    status: s.status,
    storyId: s.storyId,
  }
})

const filteredStats = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return stats
  return stats.filter(
    (c) => c.name.includes(q) || c.enName.toLowerCase().includes(q),
  )
})

const sheetSource = computed(() => {
  const s = sheet.value
  if (!s) return ''
  return (
    catalogStories.find((x) => x.countryId === s.countryId && x.title === s.title)?.source || ''
  )
})

const activeCountryLabel = computed(() => {
  const id = activeCountry.value
  if (!id) return null
  const c = catalogCountries.find((x) => x.id === id)
  return c ? `${c.enName} ${c.name}` : null
})

const panelData = computed(() => {
  const id = panelCountry.value
  if (!id) return null
  const c = catalogCountries.find((x) => x.id === id)
  if (!c) return null
  return { country: c, list: storiesOfCountry(id) }
})

function openCatalogStory(s: CatalogStory) {
  if (s.status === 'ready' && s.storyId) {
    router.push(`/story/${s.storyId}`)
    return
  }
  const c = catalogCountries.find((x) => x.id === s.countryId)!
  sheet.value = {
    key: `${s.countryId}-${s.title}`,
    emoji: s.emoji,
    title: s.title,
    countryId: s.countryId,
    countryName: c.name,
    lat: c.lat,
    lon: c.lon,
    status: s.status,
    storyId: s.storyId,
  }
}

function onMarkerTap(m: StoryMarker) {
  activeCountry.value = m.countryId
  panelCountry.value = null
  if (m.status === 'ready' && m.storyId) {
    router.push(`/story/${m.storyId}`)
  } else {
    sheet.value = m
  }
}

function selectCountry(id: string, lat: number, lon: number) {
  activeCountry.value = id
  panelCountry.value = id
  scene?.focusCountry(lat, lon)
  if (window.innerWidth < 720) sidebarOpen.value = false
}

function toggleNight() {
  night.value = !night.value
  scene?.setNight(night.value)
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
  localStorage.setItem('myth-planet-sidebar', sidebarOpen.value ? '1' : '0')
}

onMounted(() => {
  if (!canvasWrap.value) return
  scene = createEarthScene({
    container: canvasWrap.value,
    markers,
    onMarkerTap,
    onMarkerHover: (m, pos) => {
      hoverMarker.value = m
      if (pos) hoverPos.value = pos
    },
    onFlash: (o) => (flashOpacity.value = o),
    onEnterCoreDone: () => router.push('/core/greek'),
  })
})

onUnmounted(() => scene?.destroy())
</script>

<template>
  <div class="home" :class="{ night }">
    <div ref="canvasWrap" class="canvasWrap"></div>

    <!-- 顶部：标题 + 总量统计 + 当前国家 -->
    <div class="top">
      <div class="title">世 界 神 话 地 图</div>
      <div class="stats">
        {{ totalStoryCount }} 个故事 · {{ totalCountryCount }} 个国家 ·
        已撰写 {{ readyStoryCount }}
      </div>
      <div class="country" v-if="activeCountryLabel">{{ activeCountryLabel }}</div>
      <div class="barWrap"><div class="bar" :style="{ width: totalProgress + '%' }"></div></div>
      <div class="barTxt">学习进度 {{ totalProgress }}%</div>
    </div>

    <!-- 右侧国家列表 -->
    <div class="sideToggle" @click="toggleSidebar">
      {{ sidebarOpen ? '×' : '国家' }}
    </div>
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sideHead">Countries 国家</div>
      <input v-model="search" class="searchBox" placeholder="搜索国家 / Search…" />
      <div class="countryList">
        <button
          v-for="c in filteredStats"
          :key="c.id"
          class="countryItem"
          :class="{ active: activeCountry === c.id }"
          @click="selectCountry(c.id, c.lat, c.lon)"
        >
          <span class="cName">
            <b>{{ c.enName }}</b>
            <i>{{ c.name }}</i>
          </span>
          <span class="cBar">
            <span class="cBarFill" :style="{ width: Math.max(8, (c.total / stats[0].total) * 100) + '%' }"></span>
          </span>
          <span class="cNum">{{ c.total }}</span>
        </button>
        <div v-if="!filteredStats.length" class="noResult">没有匹配的国家</div>
      </div>
    </aside>

    <button class="themeBtn" @click="toggleNight">{{ night ? '复古' : '夜览' }}</button>
    <button class="coreBtn" @click="scene?.enterCore()"><span>进入<br />地心</span></button>
    <div class="hint">拖动旋转 · 点击 emoji 打开故事 · 右上角按国家筛选</div>

    <div class="bottom">
      <button class="navBtn" @click="router.push('/pets')">我的伙伴</button>
      <button class="navBtn" @click="router.push('/codex')">神话图鉴</button>
      <button class="navBtn" @click="router.push('/history')">历史长河</button>
    </div>

    <!-- 悬停故事名 -->
    <div
      v-if="hoverMarker"
      class="hoverTip"
      :style="{ left: hoverPos.x + 14 + 'px', top: hoverPos.y - 10 + 'px' }"
    >
      <span class="tipEmoji">{{ hoverMarker.emoji }}</span>
      <span class="tipTitle">{{ hoverMarker.title }}</span>
      <span class="tipMeta">
        {{ hoverMarker.countryName }} ·
        {{ hoverMarker.status === 'ready' ? '已撰写' : '待撰写' }}
      </span>
    </div>

    <!-- 国家故事清单 -->
    <transition name="slide">
      <div v-if="panelData" class="cPanel">
        <div class="cPanelHead">
          <div>
            <div class="cPanelName">{{ panelData.country.enName }} {{ panelData.country.name }}</div>
            <div class="cPanelMeta">
              {{ panelData.list.length }} 个故事 · 已撰写
              {{ panelData.list.filter((s) => s.status === 'ready').length }}
            </div>
          </div>
          <button class="cPanelClose" @click="panelCountry = null">×</button>
        </div>
        <div class="cPanelList">
          <button
            v-for="s in panelData.list"
            :key="s.title"
            class="cPanelItem"
            :class="{ planned: s.status !== 'ready' }"
            @click="openCatalogStory(s)"
          >
            <span class="iEmoji">{{ s.emoji }}</span>
            <span class="iBody">
              <span class="iTitle">{{ s.title }}</span>
              <span class="iSrc">{{ s.source }}</span>
            </span>
            <span class="iBadge">{{ s.status === 'ready' ? '阅读' : '待撰写' }}</span>
          </button>
        </div>
      </div>
    </transition>

    <div class="flash" :style="{ opacity: flashOpacity }"></div>

    <!-- 待撰写故事的说明面板 -->
    <transition name="slide">
      <div v-if="sheet" class="sheetMask" @click.self="sheet = null">
        <div class="sheet">
          <div class="sheetEmoji">{{ sheet.emoji }}</div>
          <div class="sheetTitle">{{ sheet.title }}</div>
          <div class="sheetMeta">{{ sheet.countryName }}</div>
          <div class="sheetTag">待撰写</div>
          <div class="sheetSrc">计划依据文献：{{ sheetSource }}</div>
          <p class="sheetNote">
            这一篇正文还没写。已收录的是真实存在的神话标题与计划依据的原始文献，
            正文会按文献逐篇撰写，不批量生成，避免出现来源不明的内容。
          </p>
          <button class="sheetClose" @click="sheet = null">知道了</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #f3eada;
  overflow: hidden;
  transition: background 0.5s ease;
  font-family: 'Songti SC', 'STSong', serif;
}
.home.night { background: #0d1220; }
.canvasWrap { position: absolute; inset: 0; }

.top {
  position: absolute; top: 0; left: 0; right: 0;
  padding: 18px 24px 0; text-align: center; pointer-events: none; z-index: 5;
}
.title { font-size: 18px; letter-spacing: 5px; color: #5c4a32; transition: color 0.4s; }
.stats { margin-top: 5px; font-size: 11px; letter-spacing: 1px; color: #96825f; }
.country { margin-top: 8px; font-size: 20px; letter-spacing: 2px; color: #4a3b28; }
.barWrap {
  margin: 10px auto 0; width: 46%; height: 3px;
  background: #dfd2bc; border-radius: 2px; overflow: hidden;
}
.bar { height: 100%; background: linear-gradient(90deg, #c9a227, #e3c86b); transition: width 0.4s ease; }
.barTxt { margin-top: 5px; font-size: 11px; color: #8a7658; }
.night .title, .night .country { color: #f0e4c8; }
.night .stats, .night .barTxt { color: #9fb0c8; }
.night .barWrap { background: rgba(255,255,255,0.14); }

/* 侧栏 */
.sideToggle {
  position: absolute; top: 16px; right: 16px; z-index: 12;
  width: 44px; height: 30px; line-height: 30px; text-align: center;
  font-size: 13px; border-radius: 15px; cursor: pointer;
  border: 1px solid #c4a971; background: rgba(253,248,238,0.9); color: #5c4a32;
}
.night .sideToggle { border-color: #4a5a78; background: rgba(20,28,46,0.9); color: #d8e2f2; }

.sidebar {
  position: absolute; top: 0; right: 0; bottom: 96px; z-index: 11;
  width: 264px; padding: 56px 12px 16px;
  background: rgba(250, 245, 233, 0.94);
  border-left: 1px solid #d9c79a;
  transform: translateX(100%); transition: transform 0.32s ease;
  display: flex; flex-direction: column;
  border-radius: 0 0 0 14px;
}
.sidebar.open { transform: translateX(0); }
.night .sidebar { background: rgba(14,20,34,0.94); border-left-color: #2d3a52; }

.sideHead { font-size: 12px; letter-spacing: 2px; color: #8a7658; margin-bottom: 8px; }
.night .sideHead { color: #8fa2bd; }
.searchBox {
  width: 100%; height: 32px; padding: 0 10px; margin-bottom: 10px;
  border-radius: 8px; border: 1px solid #d9c79a;
  background: #fffdf7; font-size: 12.5px; color: #4a3b28; font-family: inherit;
}
.night .searchBox { background: #131c2e; border-color: #33415c; color: #e6eefc; }

.countryList { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 3px; }
.countryItem {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 9px; border-radius: 8px; border: 1px solid transparent;
  background: transparent; text-align: left; width: 100%;
}
.countryItem.active { background: rgba(201,162,39,0.16); border-color: #c9a227; }
.night .countryItem.active { background: rgba(201,162,39,0.2); }
.cName { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.cName b { font-size: 12px; font-weight: 600; color: #4a3b28; }
.cName i { font-size: 10.5px; font-style: normal; color: #97835f; }
.night .cName b { color: #e8eefb; }
.night .cName i { color: #8b9cb8; }
.cBar { width: 46px; height: 3px; background: rgba(140,120,80,0.2); border-radius: 2px; overflow: hidden; }
.cBarFill { display: block; height: 100%; background: #c9a227; }
.cNum { width: 26px; text-align: right; font-size: 12px; color: #6d5b3e; }
.night .cNum { color: #b9c7de; }
.noResult { font-size: 12px; color: #a3927a; padding: 12px 6px; }

.themeBtn {
  position: absolute; top: 16px; left: 16px; z-index: 12;
  padding: 6px 14px; border-radius: 15px; font-size: 12.5px;
  border: 1px solid #c4a971; background: rgba(253,248,238,0.9); color: #5c4a32;
}
.night .themeBtn { border-color: #4a5a78; background: rgba(20,28,46,0.9); color: #d8e2f2; }

.coreBtn {
  position: absolute; right: 22px; bottom: 128px; z-index: 6;
  width: 72px; height: 72px; border-radius: 50%;
  border: 1.5px solid #b99a54; background: rgba(253,248,238,0.86);
  color: #5c4a32; font-size: 12.5px; line-height: 1.35;
  box-shadow: 0 4px 14px rgba(92,74,50,0.16);
}
.night .coreBtn { border-color: #6b7fa6; background: rgba(20,28,46,0.86); color: #dce6f7; }

.hint {
  position: absolute; left: 0; right: 0; bottom: 88px; text-align: center;
  font-size: 11px; color: #9c8a6c; letter-spacing: 1px; z-index: 5; pointer-events: none;
}
.night .hint { color: #7f90ab; }

.bottom {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 0 22px 26px; display: flex; gap: 12px; z-index: 5;
}
.navBtn {
  flex: 1; height: 42px; border-radius: 21px;
  border: 1.2px solid #c4a971; background: rgba(253,248,238,0.9);
  color: #5c4a32; font-size: 13.5px; letter-spacing: 2px;
}
.night .navBtn { border-color: #4a5a78; background: rgba(20,28,46,0.9); color: #d8e2f2; }

.hoverTip {
  position: fixed; z-index: 30; pointer-events: none;
  transform: translateY(-100%);
  background: rgba(46,36,22,0.92); color: #fdf6e6;
  border-radius: 10px; padding: 8px 12px; max-width: 240px;
  display: flex; flex-direction: column; gap: 2px;
}
.tipEmoji { font-size: 15px; }
.tipTitle { font-size: 13px; }
.tipMeta { font-size: 10.5px; color: #cbbb95; }

.flash {
  position: absolute; inset: 0; z-index: 7; pointer-events: none;
  background: radial-gradient(circle at 50% 50%, #fff6dc 0%, #f6e2a8 45%, rgba(243,234,218,0) 78%);
}

.sheetMask {
  position: fixed; inset: 0; z-index: 40;
  background: rgba(30,22,12,0.42);
  display: flex; align-items: flex-end; justify-content: center;
}
.sheet {
  width: 100%; max-width: 440px;
  background: #fdf6e6; border-radius: 16px 16px 0 0;
  padding: 22px 22px 26px; text-align: center;
}
.sheetEmoji { font-size: 34px; }
.sheetTitle { font-size: 19px; letter-spacing: 1px; color: #4a3b28; margin-top: 6px; }
.sheetMeta { font-size: 12px; color: #8a7658; margin-top: 4px; }
.sheetTag {
  display: inline-block; margin-top: 10px; padding: 2px 12px;
  border-radius: 10px; font-size: 11px;
  background: #eee6d4; color: #8a7658;
}
.sheetSrc { margin-top: 12px; font-size: 12.5px; color: #6d5b3e; line-height: 1.7; }
.sheetNote { margin-top: 10px; font-size: 12px; color: #8a7658; line-height: 1.8; text-align: left; }
.sheetClose {
  width: 100%; height: 42px; margin-top: 16px; border-radius: 21px;
  border: none; background: linear-gradient(90deg, #c9a227, #e3c86b);
  color: #4a3b28; font-size: 14px; letter-spacing: 2px;
}
.slide-enter-active, .slide-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(12px); }

/* 国家故事清单面板 */
.cPanel {
  position: absolute; left: 16px; bottom: 84px; z-index: 14;
  width: min(330px, calc(100vw - 32px)); max-height: 46vh;
  display: flex; flex-direction: column;
  background: rgba(250,245,233,0.96);
  border: 1px solid #d9c79a; border-radius: 14px;
  box-shadow: 0 8px 24px rgba(92,74,50,0.18);
  overflow: hidden;
}
.night .cPanel { background: rgba(14,20,34,0.96); border-color: #2d3a52; }
.cPanelHead {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 12px 14px 8px; border-bottom: 1px solid rgba(180,160,120,0.3);
}
.cPanelName { font-size: 14.5px; color: #4a3b28; letter-spacing: 1px; }
.cPanelMeta { font-size: 11px; color: #8a7658; margin-top: 3px; }
.night .cPanelName { color: #eef3fd; }
.night .cPanelMeta { color: #8fa2bd; }
.cPanelClose {
  border: none; background: transparent; font-size: 20px; line-height: 1;
  color: #9c8a6c; padding: 0 2px;
}
.cPanelList { overflow-y: auto; padding: 6px; display: flex; flex-direction: column; gap: 4px; }
.cPanelItem {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 8px 10px; border-radius: 10px; text-align: left;
  border: 1px solid transparent; background: rgba(255,255,255,0.5);
}
.night .cPanelItem { background: rgba(255,255,255,0.05); }
.cPanelItem.planned { opacity: 0.72; }
.iEmoji { font-size: 19px; flex: none; }
.iBody { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.iTitle { font-size: 13px; color: #4a3b28; }
.iSrc {
  font-size: 10.5px; color: #97835f; margin-top: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.night .iTitle { color: #e8eefb; }
.night .iSrc { color: #8b9cb8; }
.iBadge {
  flex: none; font-size: 10.5px; padding: 2px 8px; border-radius: 9px;
  border: 1px solid #c4a971; color: #6d5b3e;
}
.night .iBadge { border-color: #4a5a78; color: #b9c7de; }

/* 任何屏幕尺寸都默认收起，展开时为覆盖层，不挤压地球 */
@media (min-width: 900px) {
  .sidebar {
    border-left: 1px solid #d9c79a;
    box-shadow: -8px 0 24px rgba(92, 74, 50, 0.14);
  }
}
</style>
