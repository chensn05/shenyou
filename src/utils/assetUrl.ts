// 静态资源 URL 解析
//
// 为什么不用 `import img from '../assets/x.jpg'`：
// Vite 会编译成绝对路径 `/assets/x-<hash>.jpg`，而 Cowork 把应用挂在
// `/s/<alias>/` 子路径下，绝对路径会 404 —— 地球贴图第一版就是这样变成黑球的。
//
// 为什么不用 document.baseURI：
// 在子路由（/s/<alias>/story/jingwei）下它会解析成 story/x.jpg，同样 404。
//
// 正确做法：从当前 JS chunk 自身的 URL（/s/<alias>/assets/index-xxx.js）
// 往上一级推导出应用根，跟当前路由无关，本地和线上都对。
const APP_BASE = new URL('../', import.meta.url).href

export function assetUrl(name: string): string {
  return new URL(name, APP_BASE).href
}
