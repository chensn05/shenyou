// 神游 · 故事内容数据
// 所有正文均基于原始文献核对，出处与版本注意事项随内容一并保留，
// 不因为是 demo 就省略来源标注。

export interface QuizItem {
  q: string
  options: string[]
  answer: number // 正确选项 index
}

export interface Story {
  id: string
  culture: string
  cultureLabel: string
  title: string
  subtitle: string
  cover?: string
  body: string
  source: string
  sourceUrl?: string
  versionNote?: string
  quiz: QuizItem[]
  relatedCharacterIds: string[]
  status: 'ready' | 'planned'
}

import { storiesBatch2 } from './storiesBatch2'
import { storiesBatch3 } from './storiesBatch3'
import { storiesBatch4 } from './storiesBatch4'
import { storiesBatch5 } from './storiesBatch5'

const storiesBatch1: Story[] = [
  {
    id: 'jingwei',
    cover: 'card-jingwei',
    culture: 'china',
    cultureLabel: '中国神话',
    title: '精卫填海',
    subtitle: '炎帝少女溺于东海，化为精卫鸟，日衔西山木石以堙海。',
    cover: 'card-jingwei',
    body:
      '《山海经·北山经》记载了精卫填海的故事。在发鸠山上，生长着许多柘树。山中有一种鸟，形状像乌鸦，头上有花纹，长着白色的嘴和红色的脚，名叫"精卫"，它的叫声像是在呼唤自己的名字。这只鸟其实是炎帝最小的女儿，名叫女娃。有一次，女娃去东海游玩，不幸溺水身亡，再也没有回来。她的灵魂化作精卫鸟，从此日夜不停地从西山衔来树枝和石块，投向东海，试图把大海填平。这个行为看似徒劳，却体现了一种不屈的精神。在后世解读中，精卫常被看作执着与坚韧的象征——即使力量渺小，也绝不放弃目标。需要说明的是，《山海经》原文只描述了她"常衔西山之木石，以堙于东海"，并没有解释精卫为何要填海，这些解读都属于后世的阐释。',
    source: '《山海经·北山经》',
    sourceUrl: 'https://ctext.org/shan-hai-jing/bei-shan-jing',
    versionNote:
      '《太平广记》引文作"赤帝之女名女娙"，将"炎帝"作"赤帝"。本故事采用《山海经》原始表述"炎帝"。此处炎帝不宜直接等同于"神农氏"，两者在先秦文献中分属不同系统。',
    quiz: [
      { q: '精卫鸟的记载出自哪部古籍？', options: ['《山海经》', '《楚辞》', '《史记》'], answer: 0 },
      { q: '精卫是炎帝的什么人？', options: ['妻子', '妹妹', '最小的女儿'], answer: 2 },
      { q: '精卫从何处衔来木石填海？', options: ['南山', '西山', '北山'], answer: 1 },
    ],
    relatedCharacterIds: ['jingwei', 'yandi'],
    status: 'ready',
  },
  {
    id: 'nuwa',
    cover: 'card-nuwa',
    culture: 'china',
    cultureLabel: '中国神话',
    title: '女娲补天',
    subtitle: '四极崩坏、九州开裂，女娲炼石补天、断鳌足以立四极。',
    body:
      '据《淮南子·览冥训》记载，远古时代发生过一场大灾难：支撑天地的四极崩坏，九州大地开裂，天空无法完整覆盖大地，大地也无法承载万物。大火燃烧不息，洪水泛滥不止，猛兽吞食百姓，凶猛的鸟类抓走老弱。在这样的绝境中，女娲挺身而出：熔炼五色石修补残破的苍天，砍断巨鳌的四足重新支撑四极，杀死黑龙以拯救冀州，堆积芦灰堵住漫溢的洪水。经过她的努力，苍天被补好，四极重新端正，洪水退去，冀州恢复平静，凶猛的虫兽死去，百姓终于得以生存。',
    source: '《淮南子·览冥训》',
    sourceUrl: 'https://ctext.org/huainanzi/lan-ming-xun/zhs',
    versionNote:
      '《淮南子》原文没有描写女娲外貌，也没有"抟土造人"的情节。造人说出自《风俗通义》等后世文献，与补天属不同叙述来源，不应混为一谈。',
    quiz: [
      { q: '女娲用什么修补苍天？', options: ['五色石', '女娃的羽毛', '芦苇'], answer: 0 },
      { q: '女娲砍断什么来支撑四极？', options: ['山峰', '鳌足', '树干'], answer: 1 },
      { q: '这个故事最早出自哪部书？', options: ['《淮南子》', '《风俗通义》', '《史记》'], answer: 0 },
    ],
    relatedCharacterIds: ['nuwa'],
    status: 'ready',
  },
  {
    id: 'persephone',
    cover: 'card-persephone',
    culture: 'greek',
    cultureLabel: '古希腊神话',
    title: '珀耳塞福涅与四季',
    subtitle: '丰收女神之女被哈得斯带往冥界，母女因石榴籽之约每年相聚。',
    cover: 'card-persephone',
    body:
      '在《荷马颂歌·致德墨忒耳》中，丰收女神德墨忒耳的女儿珀耳塞福涅与海洋仙女们在草地上采花，采摘了玫瑰、番红花、紫罗兰和水仙。大地在宙斯的安排下生长出一朵神奇的水仙花作为诱饵。当她伸手去摘时，地面裂开，宙斯的兄弟哈得斯驾驶不朽战车出现，将她掳走带往冥界。德墨忒耳听到女儿的呼救声，悲痛万分，举着火炬在大地上漫游了九天九夜，不吃不喝，四处寻找。后来太阳神赫利俄斯告诉她真相：宙斯把珀耳塞福涅许配给了哈得斯。德墨忒耳因愤怒离开奥林匹斯山，化身凡人隐居厄琉息斯，使大地停止结果，引发严重饥荒。宙斯不得不派赫尔墨斯去冥界要求哈得斯放人，但在她离开前，哈得斯让她吃下一粒石榴籽。因为吃了冥界的食物，她从此每年必须部分时间回到冥界，其余时间与母亲相伴。后世常把她的往返解释为四季循环的起源。',
    source: '《荷马颂歌·致德墨忒耳》（Homeric Hymn 2 to Demeter）',
    sourceUrl: 'https://scaife.perseus.org/library/urn:cts:greekLit:tlg0013.tlg002/',
    versionNote:
      '颂歌明确写明宙斯事先同意把珀耳塞福涅给哈得斯。"四季循环"的象征性阐释是后世基于颂歌发展出的文化传统，颂歌本身的核心其实是厄琉息斯秘仪的起源。冥界停留时长在原文为"三分之一"，后世常简化为"半年一半"。',
    quiz: [
      { q: '珀耳塞福涅在采什么花时被带走？', options: ['水仙', '玫瑰', '百合'], answer: 0 },
      { q: '是谁告诉德墨忒耳真相？', options: ['赫拉', '赫利俄斯', '赫尔墨斯'], answer: 1 },
      { q: '珀耳塞福涅吃了什么食物后必须每年返回冥界？', options: ['苹果', '石榴籽', '葡萄'], answer: 1 },
    ],
    relatedCharacterIds: ['zeus', 'hades', 'demeter', 'persephone'],
    status: 'ready',
  },
  {
    id: 'amaterasu',
    cover: 'card-amaterasu',
    culture: 'japan',
    cultureLabel: '日本神话',
    title: '天照大神与天之石屋',
    subtitle: '须佐之男胡作非为，天照大神隐入石屋，众神设计引她重现光明。',
    body:
      '据《古事记》上卷记载，须佐之男命来到高天原时，姐姐天照大御神起了疑心，怀疑弟弟是来夺取自己的国土。须佐之男命为证明清白而立誓，双方交换随身物品生下子神。他自认取胜，随后开始胡作非为：毁坏天照大御神所造的田埂，在尝新谷的殿堂上排泄污物，最后把剥了皮的马扔进织衣殿，惊动了正在织衣的女神，使其被梭子刺中而死。天照大御神见此情形，躲进了天之石屋，高天原与地上世界随即陷入黑暗。众神在天安河原商议对策，制作镜与勾玉悬于神树，由天宇受卖命在石屋前起舞。石屋外传来众神的欢笑声，天照大御神心生疑惑推门探看，被守候在旁的力士神拉出石屋，光明因此重返世间。制造事端的须佐之男命则被诸神驱逐出高天原。',
    source: '《古事记》上卷',
    sourceUrl: 'https://kojiki.kokugakuin.ac.jp/zh/about-kojiki/outline/',
    versionNote:
      '起舞女神在《古事记》作"天宇受卖命"，在《日本书纪》作"天钿女命"，是同一神的不同写法，两部典籍细节存在差异，本故事采用《古事记》系统。',
    quiz: [
      { q: '天照大御神躲进了哪里？', options: ['黄泉国', '天之石屋', '海原'], answer: 1 },
      { q: '在石屋前起舞的女神是？', options: ['天宇受卖命', '木花之佐久夜毘卖', '栉名田比卖'], answer: 0 },
      { q: '事件的起因是谁的胡作非为？', options: ['月读命', '须佐之男命', '大国主神'], answer: 1 },
    ],
    relatedCharacterIds: [],
    status: 'ready',
  },
  {
    id: 'inanna',
    cover: 'card-inanna',
    culture: 'mesopotamia',
    cultureLabel: '两河流域神话',
    title: '伊南娜下冥界',
    subtitle: '女神伊南娜穿越七重冥界之门，最终由智慧之神恩基出手相救。',
    body:
      '在苏美尔诗歌《伊南娜下冥界》中，女神伊南娜从天上把心意转向"大地之下"，决定进入冥界。她携带七种神力，佩戴头巾、假发、青金石项链、王袍与金环，并叮嘱侍从宁舒布尔：若自己回不来，就依次向恩利尔、南纳、恩基求助。抵达冥界宫门后，她要求守门人内提开门。冥界女王埃列什基伽勒是她的姐姐，听闻消息后下令闩上七重门，让伊南娜每通过一道门就被剥去一件装饰。当她穿过第七道门，象征尊贵的王袍也被取走。她夺取姐姐的宝座，却被冥界七位判官宣判，化为尸体被挂在钉子上。三天三夜后，宁舒布尔依约求助。恩利尔与南纳都拒绝出手，只有智慧之神恩基应允，他从指甲缝中造出两个生灵，分别赐予生命之草与生命之水，命他们潜入冥界取回尸体并复活伊南娜。',
    source: 'ETCSL（牛津大学苏美尔文学电子文本库）《Inana\'s descent to the nether world》',
    sourceUrl: 'https://etcsl.orinst.ox.ac.uk/section1/tr141.htm',
    versionNote: '不同泥板抄本存在增删行数差异，ETCSL 译文已标注异文；故事后半段（需替身才能离开冥界）为同一文本后续段落。',
    quiz: [
      { q: '伊南娜通过了几道冥界之门？', options: ['五道', '七道', '九道'], answer: 1 },
      { q: '最终出手相救的是哪位神？', options: ['恩利尔', '南纳', '恩基'], answer: 2 },
      { q: '冥界女王埃列什基伽勒是伊南娜的？', options: ['姐姐', '女儿', '仆人'], answer: 0 },
    ],
    relatedCharacterIds: [],
    status: 'ready',
  },
  {
    id: 'odin-runes',
    cover: 'card-odin-runes',
    culture: 'norse',
    cultureLabel: '北欧神话',
    title: '奥丁悬树求符文',
    subtitle: '奥丁自悬于世界树九夜九日，以自我献祭换取符文之智。',
    body:
      '在古诺尔斯诗歌《高人的箴言》中，奥丁自述了一段极端的求知经历。他说自己曾悬挂在一棵被风吹动的树上，整整九夜，身上有长枪刺穿的伤口，作为献给奥丁的祭品——也就是"把自己献给自己"。他悬挂在那棵无人知晓其根系深处通向何方的树上，没有人递给他面包，也没有人递给他饮水。他向下俯身探看，终于取得了符文，并伴随着呼喊坠落下来，从这场自我献祭中获得了符文的知识与智慧。',
    source: '《诗体埃达·高人的箴言》（Hávamál）符文起源段',
    versionNote:
      '该段节次编号在不同校勘本中略有出入（常见标注第 138–141 节前后）。奥丁"以眼换智慧"（密米尔之泉）是另一则不同文本的故事，不与悬树求符文混同。',
    quiz: [
      { q: '奥丁在树上悬挂了多少个夜晚？', options: ['三夜', '七夜', '九夜'], answer: 2 },
      { q: '他悬树最终获得了什么？', options: ['符文', '黄金', '长生'], answer: 0 },
      { q: '他把自己献给了谁？', options: ['密米尔', '弗丽嘉', '自己'], answer: 2 },
    ],
    relatedCharacterIds: [],
    status: 'ready',
  },
]

export const stories: Story[] = [...storiesBatch1, ...storiesBatch2, ...storiesBatch3, ...storiesBatch4, ...storiesBatch5]

export function getStory(id: string) {
  return stories.find((s) => s.id === id)
}
