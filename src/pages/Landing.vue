<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { assetUrl } from '../utils/assetUrl'

const router = useRouter()
const entering = ref(false)

function enter() {
  if (entering.value) return
  entering.value = true
  // 地球放大过场后进入大地球页
  setTimeout(() => router.push('/map'), 620)
}
</script>

<template>
  <div class="landing" :class="{ entering }">
    <img :src="assetUrl('landing-bg.jpg')" class="bg" alt="" draggable="false" />
    <div class="shadeTop"></div>
    <div class="shadeCenter"></div>

    <div class="top">
      <div class="title">神 游</div>
      <div class="sub">一百零二篇神话 · 五十二个国家 · 神话与历史的长河</div>
    </div>

    <!-- 可点击的旋转地球：圆形遮罩 + 贴图横向滚动制造自转错觉 -->
    <button class="globeWrap" @click="enter" aria-label="进入神游">
      <span class="halo"></span>
      <span class="globe" :style="{ backgroundImage: `url(${assetUrl('earth-texture.jpg')})` }"></span>
      <span class="ring"></span>
    </button>

    <div class="cta">点 击 地 球 开 始 探 索</div>

    <div class="bottom">
      <span>神话故事 × 地心人物 × 历史长河 × 萌宠养成</span>
    </div>
  </div>
</template>

<style scoped>
.landing {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #05070f;
  font-family: 'Songti SC', 'STSong', serif;
  color: #f5e9c8;
}
.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: slowZoom 24s ease-in-out infinite alternate;
}
@keyframes slowZoom {
  from { transform: scale(1); }
  to { transform: scale(1.07); }
}
/* 顶部压暗，保证标题可读 */
.shadeTop {
  position: absolute;
  top: 0; left: 0; right: 0; height: 32%;
  background: linear-gradient(180deg, rgba(5,7,15,0.88), rgba(5,7,15,0));
}
/* 中央径向压暗，给地球与文字让出视觉位 */
.shadeCenter {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 68%, rgba(5,7,15,0.55) 0%, rgba(5,7,15,0) 34%);
}

.top {
  position: absolute;
  top: 7%;
  left: 0; right: 0;
  text-align: center;
  z-index: 3;
}
.title {
  font-size: 42px;
  letter-spacing: 22px;
  text-indent: 22px;
  color: #f7ecc9;
  text-shadow: 0 0 24px rgba(228, 183, 74, 0.45), 0 2px 8px rgba(0,0,0,0.8);
}
.sub {
  margin-top: 14px;
  font-size: 12.5px;
  letter-spacing: 3px;
  color: rgba(245, 233, 200, 0.72);
  text-shadow: 0 1px 6px rgba(0,0,0,0.8);
}

/* 中央旋转地球 */
.globeWrap {
  position: absolute;
  left: 50%;
  top: 68%;
  transform: translate(-50%, -50%);
  width: 190px;
  height: 190px;
  border: none;
  background: none;
  padding: 0;
  z-index: 4;
  cursor: pointer;
  transition: transform 0.6s cubic-bezier(0.5, 0, 0.2, 1);
}
.entering .globeWrap {
  transform: translate(-50%, -50%) scale(8);
  opacity: 0;
  transition: transform 0.6s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.5s ease 0.2s;
}
.globe {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-size: auto 100%;
  background-repeat: repeat-x;
  /* 贴图宽 = 地球高 × 2 = 380px，移动整宽一个贴图后无缝回环 */
  animation: spin 26s linear infinite;
  box-shadow:
    inset -22px -12px 44px rgba(0, 0, 0, 0.55),
    inset 8px 6px 24px rgba(255, 240, 200, 0.12),
    0 0 70px rgba(228, 183, 74, 0.38);
}
@keyframes spin {
  from { background-position-x: 0; }
  to { background-position-x: -380px; }
}
.halo {
  position: absolute;
  inset: -26px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(228, 183, 74, 0.28), transparent 65%);
  animation: breathe 3.2s ease-in-out infinite;
}
.ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 1px solid rgba(228, 183, 74, 0.5);
  animation: ripple 2.6s ease-out infinite;
}
@keyframes breathe {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}
@keyframes ripple {
  from { transform: scale(0.9); opacity: 0.9; }
  to { transform: scale(1.5); opacity: 0; }
}

.cta {
  position: absolute;
  top: calc(68% + 128px);
  left: 0; right: 0;
  text-align: center;
  font-size: 13px;
  letter-spacing: 6px;
  color: rgba(247, 236, 201, 0.85);
  text-shadow: 0 1px 8px rgba(0,0,0,0.9);
  animation: pulseText 2.2s ease-in-out infinite;
  z-index: 3;
}
@keyframes pulseText {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}

.bottom {
  position: absolute;
  bottom: 26px;
  left: 0; right: 0;
  text-align: center;
  font-size: 11px;
  letter-spacing: 2px;
  color: rgba(245, 233, 200, 0.45);
  z-index: 3;
}

@media (max-width: 520px) {
  .title { font-size: 32px; letter-spacing: 14px; text-indent: 14px; }
}
</style>
