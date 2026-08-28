<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { historyStories, type HistoryStory } from '../data/history'
import { isHistoryComplete, completeHistory } from '../store/progress'
import { awardForStory } from '../store/pet'

const router = useRouter()
const region = ref<'全部' | '中国' | '世界'>('全部')
const expanded = ref<string | null>(null)

function fmtYear(y: number) {
  return y < 0 ? `前${-y}` : `${y}`
}

/* ---------- 数据组织 ---------- */
interface Section {
  era: string | null
  range: string
  items: HistoryStory[]
  minYear: number
}

const sections = computed<Section[]>(() => {
  const src = region.value === '全部'
    ? historyStories
    : historyStories.filter((s) => s.region === region.value)

  if (region.value === '全部') {
    return [{ era: null, range: '', items: [...src].sort((a, b) => a.year - b.year), minYear: -9999 }]
  }
  const map = new Map<string, HistoryStory[]>()
  src.forEach((s) => {
    if (!map.has(s.era)) map.set(s.era, [])
    map.get(s.era)!.push(s)
  })
  return [...map.entries()]
    .map(([era, items]) => {
      const sorted = [...items].sort((a, b) => a.year - b.year)
      const years = sorted.map((i) => i.year)
      const min = Math.min(...years)
      const max = Math.max(...years)
      return {
        era,
        items: sorted,
        minYear: min,
        range: min === max ? `${fmtYear(min)} 年` : `${fmtYear(min)} — ${fmtYear(max)} 年`,
      }
    })
    .sort((a, b) => a.minYear - b.minYear)
})

const doneCount = computed(() => historyStories.filter((s) => isHistoryComplete(s.id)).length)

/* ---------- 答题 ---------- */
const answers = ref<Record<string, (number | null)[]>>({})
const submitted = ref<Record<string, boolean>>({})
const gained = ref<Record<string, number>>({})

function pickAnswer(sid: string, qi: number, oi: number) {
  if (submitted.value[sid]) return
  if (!answers.value[sid]) answers.value[sid] = [null, null, null]
  answers.value[sid][qi] = oi
}
function scoreOf(s: HistoryStory) {
  const a = answers.value[s.id] || []
  return s.quiz.reduce((acc, q, i) => acc + (a[i] === q.answer ? 1 : 0), 0)
}
function submit(s: HistoryStory) {
  submitted.value = { ...submitted.value, [s.id]: true }
  if (!isHistoryComplete(s.id)) {
    completeHistory(s.id)
    gained.value = { ...gained.value, [s.id]: awardForStory(scoreOf(s)) }
  }
}
</script>

<template>
  <div class="page">
    <button class="back" @click="router.push('/map')">← 返回</button>
    <div class="title">历 史 长 河</div>

    <div class="progressRow">
      <span>已学习 {{ doneCount }} / {{ historyStories.length }}</span>
      <div class="bar"><div :style="{ width: (doneCount / historyStories.length) * 100 + '%' }"></div></div>
    </div>

    <div class="regionTabs">
      <button
        v-for="r in ['全部', '中国', '世界']"
        :key="r"
        class="rt"
        :class="{ active: region === r }"
        @click="region = r as any"
      >
        {{ r }}
      </button>
    </div>

    <div class="timeline">
      <div v-for="sec in sections" :key="sec.era || 'all'" class="eraBlock">
        <!-- 时代分隔带 -->
        <div v-if="sec.era" class="eraBand">
          <span class="eraName">{{ sec.era }}</span>
          <span class="eraRange">{{ sec.range }}</span>
        </div>

        <div
          v-for="(s, i) in sec.items"
          :key="s.id"
          class="tItem"
          :class="{ left: i % 2 === 0, right: i % 2 === 1, done: isHistoryComplete(s.id) }"
        >
          <div class="tNode">
            <div class="tYearBig">{{ fmtYear(s.year) }}<span v-if="s.year < 0" class="bc">前</span></div>
            <div class="tDot"></div>
          </div>

          <div class="tCard">
            <button class="tHead" @click="expanded = expanded === s.id ? null : s.id">
              <div class="tTitleRow">
                <span class="tTitle">{{ s.title }}</span>
              </div>
              <div class="tMeta">
                <span>{{ s.yearLabel }}</span>
                <span class="tEra">{{ s.era }}</span>
                <span v-if="isHistoryComplete(s.id)" class="doneBadge">✓ 已学</span>
                <span class="expandHint">{{ expanded === s.id ? '收起 ▲' : '展开 ▼' }}</span>
              </div>
            </button>

            <div v-if="expanded === s.id" class="tBody">
              <p class="summary">{{ s.summary }}</p>
              <div class="srcBox">
                <div class="srcLabel">📖 出处</div>
                <div class="srcText">{{ s.source }}</div>
                <div v-if="s.versionNote" class="versionNote">⚠️ 史学注意：{{ s.versionNote }}</div>
              </div>

              <div class="quizBox">
                <div class="quizTitle">小测验</div>
                <div v-for="(q, qi) in s.quiz" :key="qi" class="qItem">
                  <div class="qText">{{ qi + 1 }}. {{ q.q }}</div>
                  <div class="opts">
                    <button
                      v-for="(opt, oi) in q.options"
                      :key="oi"
                      class="opt"
                      :class="{
                        picked: (answers[s.id] || [])[qi] === oi && !submitted[s.id],
                        correct: submitted[s.id] && oi === q.answer,
                        wrong: submitted[s.id] && (answers[s.id] || [])[qi] === oi && oi !== q.answer,
                      }"
                      @click="pickAnswer(s.id, qi, oi)"
                    >
                      {{ opt }}
                    </button>
                  </div>
                </div>
                <button v-if="!submitted[s.id]" class="submitBtn" @click="submit(s)">提交答案</button>
                <div v-else class="result">
                  答对 {{ scoreOf(s) }} / {{ s.quiz.length }} 题
                  <span v-if="gained[s.id]"> · 🌰 养分 +{{ gained[s.id] }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="petLink" @click="router.push('/pets')">🌰 去喂养伙伴 →</button>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f3eada;
  padding: 20px 18px 60px;
  font-family: 'Songti SC', 'STSong', serif;
  color: #4a3b28;
}
.back { background: none; border: none; color: #8a7658; font-size: 13px; margin-bottom: 10px; }
.title { text-align: center; font-size: 19px; letter-spacing: 5px; }
.sub { text-align: center; font-size: 11.5px; color: #8a7658; letter-spacing: 1px; margin-top: 6px; }

.progressRow { max-width: 420px; margin: 16px auto 12px; text-align: center; font-size: 12px; color: #7a6a4e; }
.bar { height: 4px; background: #e6dac0; border-radius: 2px; margin-top: 6px; overflow: hidden; }
.bar div { height: 100%; background: linear-gradient(90deg, #c9a227, #e3c86b); transition: width .4s ease; }

.regionTabs { display: flex; gap: 10px; max-width: 420px; margin: 0 auto 8px; }
.rt {
  flex: 1; height: 34px; border-radius: 17px; font-size: 13px;
  border: 1px solid #c4a971; background: rgba(253,248,238,0.7); color: #7a6a4e;
}
.rt.active { background: linear-gradient(90deg, #c9a227, #e3c86b); color: #4a3b28; border-color: #a9752c; }

/* ---------- 时间轴主结构 ---------- */
.timeline {
  position: relative;
  max-width: 860px;
  margin: 0 auto;
  padding: 10px 0 20px 34px;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 2px;
  background: linear-gradient(180deg, #e3c86b, #c9a227 30%, #8a6a2c 70%, #6b4f22);
  box-shadow: 0 0 10px rgba(201, 162, 39, 0.35);
}

/* 时代分隔带 */
.eraBand {
  position: relative;
  margin: 22px 0 14px -34px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.eraName {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 13px;
  background: linear-gradient(90deg, #c9a227, #e3c86b);
  color: #fff8e6;
  font-size: 13px;
  letter-spacing: 3px;
  box-shadow: 0 3px 10px rgba(160, 120, 40, 0.35);
}
.eraRange { font-size: 11px; color: #9c8a6c; letter-spacing: 1px; }

/* 事件节点 */
.tItem {
  position: relative;
  margin-bottom: 16px;
}
.tNode {
  position: absolute;
  /* timeline padding-left(34) - 轴线(14) - 圆点半径(7.5) = 12.5，让圆点中心正好压在轴线上 */
  left: -20px;
  top: 18px;
  z-index: 2;
}
.tYearBig { display: none !important; }
.tDot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #f3eada;
  border: 2.5px solid #c4a971;
  box-shadow: 0 0 0 3px #f3eada;
  transition: all 0.25s ease;
}
.tItem.done .tDot {
  background: #c9a227;
  border-color: #a9752c;
  box-shadow: 0 0 10px rgba(201, 162, 39, 0.7), 0 0 0 3px #f3eada;
}

.tCard {
  border-radius: 12px;
  border: 1px solid #e0d3b6;
  background: rgba(255, 255, 255, 0.62);
  overflow: hidden;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.tItem.done .tCard {
  border-color: #c9a227;
  box-shadow: 0 2px 12px rgba(201, 162, 39, 0.18);
}
.tHead { width: 100%; text-align: left; background: none; border: none; padding: 13px 14px 11px; }
.tTitleRow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tTitle { font-size: 15.5px; letter-spacing: 1px; }
.tMeta { display: flex; align-items: center; gap: 8px; margin-top: 6px; font-size: 10.5px; color: #9c8a6c; }
.tEra { color: #8a7658; }
.doneBadge { color: #4a6a3a; }
.expandHint { margin-left: auto; color: #b0a284; }

.tBody { border-top: 1px dashed #d9c79a; padding: 14px; }
.summary { font-size: 13.5px; line-height: 1.9; text-align: justify; margin-bottom: 14px; }
.srcBox {
  background: rgba(201, 162, 39, 0.08); border: 1px solid #d9c79a;
  border-radius: 10px; padding: 12px 14px; margin-bottom: 18px; font-size: 12px; line-height: 1.8;
}
.srcLabel { font-weight: bold; margin-bottom: 3px; }
.versionNote { margin-top: 6px; color: #8a5a2c; font-size: 11.5px; }

.quizTitle { font-size: 14px; letter-spacing: 2px; margin-bottom: 12px; }
.qItem { margin-bottom: 14px; }
.qText { font-size: 13px; margin-bottom: 7px; }
.opts { display: flex; flex-direction: column; gap: 6px; }
.opt {
  text-align: left; padding: 9px 11px; border-radius: 8px;
  border: 1px solid #c4a971; background: #fdf8ee; color: #4a3b28; font-size: 12.5px;
}
.opt.picked { border-color: #a9752c; background: #f1e2bc; }
.opt.correct { border-color: #6a8a5a; background: #e2ecd8; }
.opt.wrong { border-color: #b25a4a; background: #f3d9d2; }
.submitBtn {
  width: 100%; height: 40px; border-radius: 20px; border: none;
  background: linear-gradient(90deg, #c9a227, #e3c86b); color: #4a3b28;
  font-size: 13px; letter-spacing: 2px; margin-top: 4px;
}
.result { text-align: center; font-size: 13px; margin-top: 8px; color: #5c4a32; }

.petLink {
  display: block; margin: 10px auto 0; padding: 11px 26px; border-radius: 21px;
  border: 1px solid #c4a971; background: rgba(201, 162, 39, 0.12); color: #a9752c; font-size: 13px;
  width: fit-content;
}

/* ---------- 桌面端：中央主轴 + 左右交错 ---------- */
@media (min-width: 900px) {
  .timeline { padding-left: 0; }
  .timeline::before { left: 50%; transform: translateX(-50%); }
  .eraBand { justify-content: center; margin-left: 0; }
  .tItem { width: 50%; }
  .tItem.left { padding-right: 46px; }
  .tItem.right { margin-left: 50%; padding-left: 46px; }
  .tItem .tNode { left: auto; right: -8px; }
  .tItem.right .tNode { left: -8px; right: auto; }
  .tItem.left .tNode { flex-direction: row-reverse; }
}
</style>
