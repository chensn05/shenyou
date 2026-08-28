// 神游 · 人物图鉴数据
// 每张人物卡都标注原始出处；layer 必须与 cultures.ts 里对应文化圈的层名完全一致，
// 否则该人物不会出现在分层页上（早期中国层名对不上导致整层空白的坑）。

import { charactersBatch2 } from './charactersBatch2'

export interface Relation {
  targetId: string
  label: string
  source?: string
}

export interface Character {
  id: string
  name: string
  altName?: string
  emoji: string
  culture: string
  cultureLabel: string
  source: string
  identity: string
  deeds: string
  layer: string
  relations: Relation[]
  relatedStoryIds: string[]
  versionNote?: string
}

const charactersBase: Character[] = [
  // ============ 中国（层：天界层 / 神域层（昆仑）/ 人间层（九州）/ 幽都层）============
  {
    id: 'jingwei', name: '精卫', altName: '女娃', emoji: '🐦',
    culture: 'china', cultureLabel: '中国神话', source: '《山海经·北山经》',
    identity: '炎帝之少女，溺于东海后化为神鸟',
    deeds: '常衔西山木石，投于东海以堙海',
    layer: '人间层（九州）',
    relations: [{ targetId: 'yandi', label: '父女', source: '《山海经·北山经》' }],
    relatedStoryIds: ['jingwei'],
  },
  {
    id: 'yandi', name: '炎帝', emoji: '🔥',
    culture: 'china', cultureLabel: '中国神话', source: '《山海经·北山经》仅提及其为女娃之父',
    identity: '女娃（精卫）之父',
    deeds: '本故事中未直接出场',
    layer: '人间层（九州）',
    relations: [{ targetId: 'jingwei', label: '父女', source: '《山海经·北山经》' }],
    relatedStoryIds: ['jingwei'],
    versionNote: '不宜直接等同于"神农氏"，两者在先秦文献中分属不同叙述系统，后世才逐渐合并。',
  },
  {
    id: 'nuwa', name: '女娲', emoji: '🪨',
    culture: 'china', cultureLabel: '中国神话', source: '《淮南子·览冥训》',
    identity: '补天救世的创世女神',
    deeds: '炼五色石补天，断鳌足立四极，杀黑龙、堆芦灰治洪水',
    layer: '神域层（昆仑）',
    relations: [],
    relatedStoryIds: ['nuwa'],
    versionNote: '"抟土造人"出自《风俗通义》等后世文献，与补天故事来源不同。',
  },
  {
    id: 'xiwangmu', name: '西王母', emoji: '🐆',
    culture: 'china', cultureLabel: '中国神话', source: '《山海经》《淮南子·览冥训》',
    identity: '居昆仑之丘的女神，掌不死之药',
    deeds: '后羿曾向她求得不死之药，后被姮娥窃走',
    layer: '神域层（昆仑）',
    relations: [],
    relatedStoryIds: ['change'],
    versionNote: '《山海经》中"豹尾虎齿"的原始形象，与后世道教中的王母娘娘差异很大。',
  },

  // ============ 日本（层：高天原 / 海原 / 苇原中国 / 黄泉国）============
  {
    id: 'amaterasu', name: '天照大御神', emoji: '☀️',
    culture: 'japan', cultureLabel: '日本神话', source: '《古事记》上卷',
    identity: '太阳女神，高天原之主',
    deeds: '因须佐之男胡作非为而隐入天之石屋，世界陷入黑暗，后被众神引出',
    layer: '高天原',
    relations: [{ targetId: 'susanoo', label: '姐弟', source: '《古事记》上卷' }],
    relatedStoryIds: ['amaterasu', 'orochi'],
  },
  {
    id: 'susanoo', name: '须佐之男命', emoji: '🐉',
    culture: 'japan', cultureLabel: '日本神话', source: '《古事记》上卷',
    identity: '海原之主，天照大御神之弟',
    deeds: '大闹高天原被逐；在出云以烈酒灌醉八俣大蛇并将其斩杀，蛇尾得草薙剑',
    layer: '海原',
    relations: [{ targetId: 'amaterasu', label: '姐弟', source: '《古事记》上卷' }],
    relatedStoryIds: ['amaterasu', 'orochi'],
  },
  {
    id: 'okuninushi', name: '大穴牟迟神', altName: '大国主神', emoji: '🐰',
    culture: 'japan', cultureLabel: '日本神话', source: '《古事记》上卷',
    identity: '须佐之男的六世孙，后成为苇原中国之主',
    deeds: '教因幡白兔疗伤之法，得白兔预言娶到八上比卖',
    layer: '苇原中国',
    relations: [],
    relatedStoryIds: ['inaba'],
  },
  {
    id: 'izanami', name: '伊邪那美', emoji: '🕯️',
    culture: 'japan', cultureLabel: '日本神话', source: '《古事记》上卷',
    identity: '创世二神之一，生火神后陨落入黄泉',
    deeds: '伊邪那岐追至黄泉国，因被窥见丑容而发怒，派黄泉丑女与雷神追赶',
    layer: '黄泉国',
    relations: [],
    relatedStoryIds: [],
    versionNote: '她与伊邪那岐"每天绞死千人/建一千五百产房"的对答，是《古事记》对人类繁衍起源的解释。',
  },

  // ============ 印度（层：梵天界 / 天界（因陀罗）/ 人间界 / 地下界（那伽））============
  {
    id: 'brahma', name: '梵天', emoji: '🪷',
    culture: 'india', cultureLabel: '印度神话', source: '往世书传统',
    identity: '创造之神，常被视为三相神之一',
    deeds: '居最高梵天界，与世界的创造相关',
    layer: '梵天界',
    relations: [],
    relatedStoryIds: [],
  },
  {
    id: 'indra', name: '因陀罗', emoji: '⚡',
    culture: 'india', cultureLabel: '印度神话', source: '《梨俱吠陀》',
    identity: '天界之主，雷霆与战争之神',
    deeds: '骑白象、执金刚杵，与天界众神同列',
    layer: '天界（因陀罗）',
    relations: [],
    relatedStoryIds: [],
  },
  {
    id: 'naga', name: '那伽', emoji: '🐍',
    culture: 'india', cultureLabel: '印度神话', source: '《摩诃婆罗多》及往世书',
    identity: '地下界的蛇族，半神半蛇',
    deeds: '居于地下宫殿，搅乳海故事中巨蛇婆苏吉即属蛇族',
    layer: '地下界（那伽）',
    relations: [],
    relatedStoryIds: ['samudra'],
  },

  // ============ 两河（层：天界（安努）/ 大地层（恩利尔）/ 深渊层（恩基）/ 冥界层（埃列什基伽勒））============
  {
    id: 'inanna', name: '伊南娜', emoji: '⭐',
    culture: 'mesopotamia', cultureLabel: '两河流域神话', source: 'ETCSL 苏美尔文学文本库',
    identity: '爱与战争女神，自称"从天到地"的行者',
    deeds: '携七种神力穿越冥界七重门，被判官处死，后由恩基遣生灵复活',
    layer: '天界（安努）',
    relations: [{ targetId: 'ereshkigal', label: '姐妹', source: 'ETCSL《伊南娜下冥界》' }],
    relatedStoryIds: ['inanna'],
  },
  {
    id: 'enki', name: '恩基', emoji: '💧',
    culture: 'mesopotamia', cultureLabel: '两河流域神话', source: 'ETCSL / 《吉尔伽美什史诗》',
    identity: '智慧与水之神，居淡水深渊',
    deeds: '造生灵救活伊南娜；洪水前透过芦苇墙向乌特纳皮什提姆报信',
    layer: '深渊层（恩基）',
    relations: [],
    relatedStoryIds: ['inanna', 'gilgamesh-flood'],
  },
  {
    id: 'ereshkigal', name: '埃列什基伽勒', emoji: '🖤',
    culture: 'mesopotamia', cultureLabel: '两河流域神话', source: 'ETCSL《伊南娜下冥界》',
    identity: '冥界女王，伊南娜的姐姐',
    deeds: '下令闩上七重门，命守门人逐层剥去伊南娜的装饰',
    layer: '冥界层（埃列什基伽勒）',
    relations: [{ targetId: 'inanna', label: '姐妹', source: 'ETCSL《伊南娜下冥界》' }],
    relatedStoryIds: ['inanna'],
  },

  // ============ 希腊（层：至高神层 / 神域层 / 人间层 / 冥界层）============
  {
    id: 'zeus', name: '宙斯', altName: 'Zeus', emoji: '⚡',
    culture: 'greek', cultureLabel: '古希腊神话', source: '《荷马颂歌·致德墨忒耳》',
    identity: '众神之王',
    deeds: '安排女儿珀耳塞福涅与哈得斯的婚姻；饥荒后派赫尔墨斯干预',
    layer: '至高神层',
    relations: [
      { targetId: 'persephone', label: '父女', source: '荷马颂歌 line 29-30' },
      { targetId: 'hades', label: '兄弟', source: '荷马颂歌 line 80' },
    ],
    relatedStoryIds: ['persephone', 'prometheus', 'pandora'],
  },
  {
    id: 'hades', name: '哈得斯', altName: 'Hades', emoji: '💀',
    culture: 'greek', cultureLabel: '古希腊神话', source: '《荷马颂歌·致德墨忒耳》',
    identity: '冥界之王，宙斯之兄',
    deeds: '在宙斯许可下带走珀耳塞福涅；以石榴籽约定她每年必须返回',
    layer: '冥界层',
    relations: [
      { targetId: 'zeus', label: '兄弟', source: '荷马颂歌 line 80' },
      { targetId: 'persephone', label: '配偶', source: '荷马颂歌' },
    ],
    relatedStoryIds: ['persephone'],
  },
  {
    id: 'demeter', name: '德墨忒耳', altName: 'Demeter', emoji: '🌾',
    culture: 'greek', cultureLabel: '古希腊神话', source: '《荷马颂歌·致德墨忒耳》',
    identity: '丰收女神，珀耳塞福涅之母',
    deeds: '女儿被掳后离开诸神，化身凡人隐居厄琉息斯，使大地停止结果',
    layer: '神域层',
    relations: [{ targetId: 'persephone', label: '母女', source: '荷马颂歌' }],
    relatedStoryIds: ['persephone'],
  },
  {
    id: 'persephone', name: '珀耳塞福涅', altName: 'Persephone', emoji: '🌸',
    culture: 'greek', cultureLabel: '古希腊神话', source: '《荷马颂歌·致德墨忒耳》',
    identity: '德墨忒耳之女，冥后',
    deeds: '被哈得斯掳往冥界；因吃石榴籽，每年部分时间往返冥界与人间',
    layer: '冥界层',
    relations: [
      { targetId: 'demeter', label: '母女', source: '荷马颂歌' },
      { targetId: 'hades', label: '配偶', source: '荷马颂歌' },
      { targetId: 'zeus', label: '父女', source: '荷马颂歌 line 29-30' },
    ],
    relatedStoryIds: ['persephone'],
  },
  {
    id: 'prometheus', name: '普罗米修斯', emoji: '🔥',
    culture: 'greek', cultureLabel: '古希腊神话', source: '赫西俄德《神谱》《工作与时日》',
    identity: '泰坦神，人类的护佑者',
    deeds: '把火藏在中空茴香茎里盗回人间，被宙斯缚于柱上受鹰啄肝之罚',
    layer: '神域层',
    relations: [{ targetId: 'zeus', label: '对抗', source: '赫西俄德《神谱》' }],
    relatedStoryIds: ['prometheus', 'pandora'],
  },
  {
    id: 'pandora', name: '潘多拉', emoji: '🏺',
    culture: 'greek', cultureLabel: '古希腊神话', source: '赫西俄德《工作与时日》',
    identity: '众神所造的第一个女人，"众神的赠礼"',
    deeds: '揭开大陶罐，使疾病与劳苦散入人间，唯希望留存罐中',
    layer: '人间层',
    relations: [],
    relatedStoryIds: ['pandora'],
  },

  // ============ 北欧（层：阿斯加德 / 华纳海姆 / 米德加尔德 / 约顿海姆 / 赫尔海姆）============
  {
    id: 'odin', name: '奥丁', emoji: '🌳',
    culture: 'norse', cultureLabel: '北欧神话', source: '《诗体埃达·高人的箴言》',
    identity: '阿萨神族之主，智慧与符文之神',
    deeds: '自悬于风中之树九夜，以"把自己献给自己"换取符文',
    layer: '阿斯加德',
    relations: [],
    relatedStoryIds: ['odin-runes', 'ragnarok'],
  },
  {
    id: 'thor', name: '托尔', emoji: '🔨',
    culture: 'norse', cultureLabel: '北欧神话', source: '《诗体埃达》',
    identity: '雷神，妙尔尼尔神锤的主人',
    deeds: '诸神黄昏中与尘世巨蟒耶梦加得同归于尽',
    layer: '阿斯加德',
    relations: [],
    relatedStoryIds: ['ragnarok'],
  },
  {
    id: 'loki', name: '洛基', emoji: '🐍',
    culture: 'norse', cultureLabel: '北欧神话', source: '斯诺里《散文埃达》',
    identity: '居于阿萨神族中的诡变之神',
    deeds: '诸神黄昏中与海姆达尔彼此毁灭',
    layer: '阿斯加德',
    relations: [],
    relatedStoryIds: ['ragnarok'],
  },
  {
    id: 'fenrir', name: '芬里尔', emoji: '🐺',
    culture: 'norse', cultureLabel: '北欧神话', source: '《诗体埃达·女先知的预言》',
    identity: '被锁链束缚的巨狼',
    deeds: '诸神黄昏中挣脱锁链，吞噬奥丁',
    layer: '约顿海姆',
    relations: [],
    relatedStoryIds: ['ragnarok'],
  },
  {
    id: 'hel', name: '赫尔', emoji: '🌑',
    culture: 'norse', cultureLabel: '北欧神话', source: '斯诺里《散文埃达》',
    identity: '死者之国的统治者',
    deeds: '掌管赫尔海姆，收纳非战死的亡者',
    layer: '赫尔海姆',
    relations: [],
    relatedStoryIds: [],
  },
]

export const characters: Character[] = [...charactersBase, ...charactersBatch2]

export function getCharacter(id: string) {
  return characters.find((c) => c.id === id)
}

export function charactersByCulture(culture: string) {
  return characters.filter((c) => c.culture === culture)
}
