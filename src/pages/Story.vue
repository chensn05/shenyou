<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStory } from '../data/stories'
import { completeStory, isStoryComplete } from '../store/progress'
import { awardForStory } from '../store/pet'
import { assetUrl } from '../utils/assetUrl'

const route = useRoute()
const router = useRouter()

const story = computed(() => getStory(String(route.params.id)))
const coverUrl = computed(() => {
  if (!story.value?.cover) return null
  return assetUrl(`${story.value.cover}.jpg`)
})

const answers = ref<(number | null)[]>([])
const submitted = ref(false)

function selectAnswer(qIndex: number, optIndex: number) {
  if (submitted.value) return
  answers.value[qIndex] = optIndex
}

const score = computed(() => {
  if (!story.value) return 0
  return story.value.quiz.reduce((acc, q, i) => acc + (answers.value[i] === q.answer ? 1 : 0), 0)
})

const gained = ref(0)

function submitQuiz() {
  if (!story.value) return
  submitted.value = true
  const already = isStoryComplete(story.value.id)
  completeStory(story.value.id, story.value.relatedCharacterIds)
  // 养分只在首次完成时发，避免反复刷
  if (!already) gained.value = awardForStory(score.value)
}

const done = computed(() => (story.value ? isStoryComplete(story.value.id) : false))
</script>

<template>
  <div class="page" v-if="story">
    <button class="back" @click="router.back()">← 返回</button>

    <img v-if="coverUrl" :src="coverUrl" class="cover" alt="" />

    <div class="tag">{{ story.cultureLabel }}</div>
    <h1 class="title">{{ story.title }}</h1>
    <p class="subtitle">{{ story.subtitle }}</p>

    <p class="body">{{ story.body }}</p>

    <div class="sourceBox">
      <div class="sourceLabel">📖 出处</div>
      <div class="sourceText">
        {{ story.source }}
        <a v-if="story.sourceUrl" :href="story.sourceUrl" target="_blank" rel="noopener">原文核对</a>
      </div>
      <div v-if="story.versionNote" class="versionNote">⚠️ 版本注意：{{ story.versionNote }}</div>
    </div>

    <div class="quizBox">
      <div class="quizTitle">小测验</div>
      <div v-for="(q, qi) in story.quiz" :key="qi" class="qItem">
        <div class="qText">{{ qi + 1 }}. {{ q.q }}</div>
        <div class="opts">
          <button
            v-for="(opt, oi) in q.options"
            :key="oi"
            class="opt"
            :class="{
              picked: answers[qi] === oi && !submitted,
              correct: submitted && oi === q.answer,
              wrong: submitted && answers[qi] === oi && oi !== q.answer,
            }"
            @click="selectAnswer(qi, oi)"
          >
            {{ opt }}
          </button>
        </div>
      </div>

      <button v-if="!submitted" class="submitBtn" @click="submitQuiz">提交答案</button>
      <div v-else class="result">
        答对 {{ score }} / {{ story.quiz.length }} 题
        <span v-if="gained > 0"> · 🌰 养分 +{{ gained }}</span>
        <span v-else-if="done"> · ✅ 已收录过，不重复发养分</span>
      </div>
      <button v-if="gained > 0" class="petLink" @click="router.push('/pets')">去喂养伙伴 →</button>
    </div>
  </div>
  <div v-else class="page">
    <p>故事不存在。</p>
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
.back {
  background: none;
  border: none;
  color: #8a7658;
  font-size: 13px;
  margin-bottom: 14px;
  cursor: pointer;
}
.cover {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 16px;
  box-shadow: 0 6px 18px rgba(92, 74, 50, 0.18);
}
.tag {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 1px;
  color: #8a7658;
  border: 1px solid #c4a971;
  border-radius: 10px;
  padding: 2px 10px;
  margin-bottom: 8px;
}
.title {
  font-size: 22px;
  letter-spacing: 2px;
  margin: 4px 0 8px;
}
.subtitle {
  font-size: 13px;
  color: #7a6a4e;
  margin-bottom: 18px;
  line-height: 1.6;
}
.body {
  font-size: 15px;
  line-height: 2;
  text-align: justify;
  margin-bottom: 22px;
}
.sourceBox {
  background: rgba(201, 162, 39, 0.08);
  border: 1px solid #d9c79a;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 26px;
  font-size: 12.5px;
  line-height: 1.8;
}
.sourceLabel {
  font-weight: bold;
  margin-bottom: 4px;
}
.sourceText a {
  margin-left: 8px;
  color: #a9752c;
}
.versionNote {
  margin-top: 8px;
  color: #8a5a2c;
}
.quizBox {
  border-top: 1px dashed #c4a971;
  padding-top: 18px;
}
.quizTitle {
  font-size: 15px;
  letter-spacing: 2px;
  margin-bottom: 14px;
}
.qItem {
  margin-bottom: 16px;
}
.qText {
  font-size: 14px;
  margin-bottom: 8px;
}
.opts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.opt {
  text-align: left;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #c4a971;
  background: #fdf8ee;
  color: #4a3b28;
  font-size: 13px;
}
.opt.picked {
  border-color: #a9752c;
  background: #f1e2bc;
}
.opt.correct {
  border-color: #6a8a5a;
  background: #e2ecd8;
}
.opt.wrong {
  border-color: #b25a4a;
  background: #f3d9d2;
}
.submitBtn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  border: none;
  background: linear-gradient(90deg, #c9a227, #e3c86b);
  color: #4a3b28;
  font-size: 14px;
  letter-spacing: 2px;
  margin-top: 6px;
}
.result {
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
  color: #5c4a32;
}
.petLink {
  display: block;
  margin: 12px auto 0;
  padding: 9px 22px;
  border-radius: 20px;
  border: 1px solid #c4a971;
  background: rgba(201, 162, 39, 0.12);
  color: #a9752c;
  font-size: 13px;
}
</style>
