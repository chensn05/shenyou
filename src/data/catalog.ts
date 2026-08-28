// 神游 · 故事目录（地球表面的 emoji 标记数据源）
//
// 内容诚实分级：
//   status: 'ready'   —— 正文已按原始文献撰写，含出处 / 版本注意 / 答题
//   status: 'planned' —— 仅收录真实存在的神话标题 + 计划依据的原始文献，正文待撰写
//
// 刻意不铺到几千条：批量生成正文会破坏"权威 + 正确"的前提。
// 标题与文献出处属客观事实，可先入目录；正文按文献逐篇补。

export interface CatalogCountry {
  id: string
  name: string
  enName: string
  lat: number
  lon: number
}

export interface CatalogStory {
  countryId: string
  title: string
  emoji: string
  source: string
  storyId?: string
  status: 'ready' | 'planned'
}

export const catalogCountries: CatalogCountry[] = [
  // 东亚
  { id: 'cn', name: '中国', enName: 'China', lat: 35, lon: 105 },
  { id: 'jp', name: '日本', enName: 'Japan', lat: 36, lon: 138 },
  { id: 'kr', name: '韩国', enName: 'South Korea', lat: 36, lon: 128 },
  { id: 'mn', name: '蒙古', enName: 'Mongolia', lat: 46, lon: 104 },
  // 东南亚 / 南亚
  { id: 'vn', name: '越南', enName: 'Vietnam', lat: 16, lon: 106 },
  { id: 'th', name: '泰国', enName: 'Thailand', lat: 15, lon: 101 },
  { id: 'id', name: '印度尼西亚', enName: 'Indonesia', lat: -2, lon: 118 },
  { id: 'my', name: '马来西亚', enName: 'Malaysia', lat: 4, lon: 102 },
  { id: 'in', name: '印度', enName: 'India', lat: 22, lon: 79 },
  { id: 'np', name: '尼泊尔', enName: 'Nepal', lat: 28, lon: 84 },
  { id: 'lk', name: '斯里兰卡', enName: 'Sri Lanka', lat: 7, lon: 81 },
  { id: 'pk', name: '巴基斯坦', enName: 'Pakistan', lat: 30, lon: 70 },
  // 西亚 / 中亚
  { id: 'iq', name: '伊拉克', enName: 'Iraq', lat: 33, lon: 44 },
  { id: 'ir', name: '伊朗', enName: 'Iran', lat: 32, lon: 53 },
  { id: 'tr', name: '土耳其', enName: 'Turkey', lat: 39, lon: 35 },
  { id: 'sy', name: '叙利亚', enName: 'Syria', lat: 35, lon: 38 },
  { id: 'ge', name: '格鲁吉亚', enName: 'Georgia', lat: 42, lon: 43 },
  { id: 'am', name: '亚美尼亚', enName: 'Armenia', lat: 40, lon: 45 },
  // 欧洲
  { id: 'gr', name: '希腊', enName: 'Greece', lat: 39, lon: 22 },
  { id: 'it', name: '意大利', enName: 'Italy', lat: 42, lon: 12 },
  { id: 'es', name: '西班牙', enName: 'Spain', lat: 40, lon: -4 },
  { id: 'fr', name: '法国', enName: 'France', lat: 46, lon: 2 },
  { id: 'de', name: '德国', enName: 'Germany', lat: 51, lon: 10 },
  { id: 'gb', name: '英国', enName: 'United Kingdom', lat: 54, lon: -2 },
  { id: 'ie', name: '爱尔兰', enName: 'Ireland', lat: 53, lon: -8 },
  { id: 'is', name: '冰岛', enName: 'Iceland', lat: 64, lon: -19 },
  { id: 'no', name: '挪威', enName: 'Norway', lat: 61, lon: 8 },
  { id: 'dk', name: '丹麦', enName: 'Denmark', lat: 56, lon: 10 },
  { id: 'fi', name: '芬兰', enName: 'Finland', lat: 62, lon: 26 },
  { id: 'lt', name: '立陶宛', enName: 'Lithuania', lat: 55, lon: 24 },
  { id: 'pl', name: '波兰', enName: 'Poland', lat: 52, lon: 19 },
  { id: 'ua', name: '乌克兰', enName: 'Ukraine', lat: 49, lon: 32 },
  { id: 'ro', name: '罗马尼亚', enName: 'Romania', lat: 46, lon: 25 },
  { id: 'ru', name: '俄罗斯', enName: 'Russia', lat: 60, lon: 90 },
  // 非洲
  { id: 'eg', name: '埃及', enName: 'Egypt', lat: 26, lon: 30 },
  { id: 'ma', name: '摩洛哥', enName: 'Morocco', lat: 32, lon: -6 },
  { id: 'ml', name: '马里', enName: 'Mali', lat: 17, lon: -4 },
  { id: 'gh', name: '加纳', enName: 'Ghana', lat: 8, lon: -1 },
  { id: 'ng', name: '尼日利亚', enName: 'Nigeria', lat: 9, lon: 8 },
  { id: 'et', name: '埃塞俄比亚', enName: 'Ethiopia', lat: 9, lon: 40 },
  { id: 'ke', name: '肯尼亚', enName: 'Kenya', lat: 0, lon: 38 },
  { id: 'za', name: '南非', enName: 'South Africa', lat: -29, lon: 24 },
  // 美洲
  { id: 'us', name: '美国', enName: 'United States', lat: 39, lon: -98 },
  { id: 'ca', name: '加拿大', enName: 'Canada', lat: 56, lon: -106 },
  { id: 'mx', name: '墨西哥', enName: 'Mexico', lat: 23, lon: -102 },
  { id: 'gt', name: '危地马拉', enName: 'Guatemala', lat: 15, lon: -90 },
  { id: 'co', name: '哥伦比亚', enName: 'Colombia', lat: 4, lon: -73 },
  { id: 'pe', name: '秘鲁', enName: 'Peru', lat: -10, lon: -76 },
  { id: 'br', name: '巴西', enName: 'Brazil', lat: -10, lon: -52 },
  { id: 'cl', name: '智利', enName: 'Chile', lat: -35, lon: -71 },
  // 大洋洲
  { id: 'au', name: '澳大利亚', enName: 'Australia', lat: -25, lon: 133 },
  { id: 'nz', name: '新西兰', enName: 'New Zealand', lat: -41, lon: 174 },
]

export const catalogStories: CatalogStory[] = [
  // ---------- 中国 ----------
  { countryId: 'cn', title: '精卫填海', emoji: '🐦', source: '《山海经·北山经》', storyId: 'jingwei', status: 'ready' },
  { countryId: 'cn', title: '女娲补天', emoji: '🪨', source: '《淮南子·览冥训》', storyId: 'nuwa', status: 'ready' },
  { countryId: 'cn', title: '夸父逐日', emoji: '☀️', source: '《山海经·海外北经》', storyId: 'kuafu', status: 'ready' },
  { countryId: 'cn', title: '后羿射日', emoji: '🏹', source: '《淮南子·本经训》', storyId: 'houyi', status: 'ready' },
  { countryId: 'cn', title: '嫦娥奔月', emoji: '🌕', source: '《淮南子·览冥训》', storyId: 'change', status: 'ready' },
  { countryId: 'cn', title: '大禹治水', emoji: '🌊', source: '《尚书·禹贡》《史记·夏本纪》', storyId: 'dayu', status: 'ready' },
  { countryId: 'cn', title: '牛郎织女', emoji: '🌌', source: '《诗经·小雅》《古诗十九首》', storyId: 'niulang', status: 'ready' },
  { countryId: 'cn', title: '黄帝战蚩尤', emoji: '⚔️', source: '《山海经·大荒北经》《史记·五帝本纪》', storyId: 'huangdi', status: 'ready' },
  { countryId: 'cn', title: '共工触山', emoji: '🗻', source: '《淮南子·天文训》', storyId: 'gonggong', status: 'ready' },

  // ---------- 日本 ----------
  { countryId: 'jp', title: '天照大神与天之石屋', emoji: '☀️', source: '《古事记》上卷', storyId: 'amaterasu', status: 'ready' },
  { countryId: 'jp', title: '斩八岐大蛇', emoji: '🐉', source: '《古事记》上卷', storyId: 'orochi', status: 'ready' },
  { countryId: 'jp', title: '因幡白兔', emoji: '🐰', source: '《古事记》上卷', storyId: 'inaba', status: 'ready' },
  { countryId: 'jp', title: '伊邪那岐访黄泉', emoji: '🕯️', source: '《古事记》上卷', storyId: 'yomi', status: 'ready' },
  { countryId: 'jp', title: '浦岛太郎', emoji: '🐢', source: '《日本书纪》《万叶集》', storyId: 'urashima', status: 'ready' },
  { countryId: 'jp', title: '竹取物语·辉夜姬', emoji: '🎋', source: '《竹取物语》', storyId: 'kaguya', status: 'ready' },

  // ---------- 韩国 / 蒙古 ----------
  { countryId: 'kr', title: '檀君建国', emoji: '🐻', source: '《三国遗事》', storyId: 'dangun', status: 'ready' },
  { countryId: 'kr', title: '朱蒙建高句丽', emoji: '🏹', source: '《三国史记》《三国遗事》', storyId: 'jumong', status: 'ready' },
  { countryId: 'kr', title: '沈清传', emoji: '🌊', source: '朝鲜古典小说《沈清传》', storyId: 'simcheong', status: 'ready' },
  { countryId: 'mn', title: '江格尔', emoji: '🐎', source: '卫拉特史诗《江格尔》', storyId: 'jangar', status: 'ready' },

  // ---------- 东南亚 ----------
  { countryId: 'vn', title: '山精水精', emoji: '⛰️', source: '《岭南摭怪》', storyId: 'sontinh', status: 'ready' },
  { countryId: 'vn', title: '貉龙君与妪姬', emoji: '🐉', source: '《岭南摭怪》', storyId: 'laclongquan', status: 'ready' },
  { countryId: 'th', title: '拉玛坚', emoji: '🐒', source: '泰国《拉玛坚》', storyId: 'ramakien', status: 'ready' },
  { countryId: 'id', title: '罗罗·琼格朗与千座神庙', emoji: '🛕', source: '爪哇口传传说', storyId: 'roro', status: 'ready' },
  { countryId: 'my', title: '汉都亚', emoji: '⚓', source: '《马来纪年》', storyId: 'hangtuah', status: 'ready' },

  // ---------- 南亚 ----------
  { countryId: 'in', title: '搅乳海', emoji: '🥛', source: '《摩诃婆罗多·初篇》', storyId: 'samudra', status: 'ready' },
  { countryId: 'in', title: '罗摩救悉多', emoji: '🏹', source: '《罗摩衍那》', storyId: 'rama-sita', status: 'ready' },
  { countryId: 'in', title: '恒河下凡', emoji: '🌊', source: '《罗摩衍那》', storyId: 'ganga', status: 'ready' },
  { countryId: 'in', title: '迦内什的象头', emoji: '🐘', source: '《湿婆往世书》', storyId: 'ganesha', status: 'ready' },
  { countryId: 'in', title: '黑天举山', emoji: '🏔️', source: '《薄伽梵往世书》', storyId: 'krishna-hill', status: 'ready' },
  { countryId: 'np', title: '加德满都谷地的开辟', emoji: '🗻', source: '《斯瓦扬布往世书》', storyId: 'kathmandu', status: 'ready' },
  { countryId: 'lk', title: '维阇耶登岛', emoji: '⛵', source: '《大史》（Mahāvaṃsa）', storyId: 'vijaya', status: 'ready' },
  { countryId: 'pk', title: '索赫尼与马希瓦尔', emoji: '🏺', source: '旁遮普口传叙事诗', storyId: 'sohni', status: 'ready' },

  // ---------- 两河 / 西亚 ----------
  { countryId: 'iq', title: '伊南娜下冥界', emoji: '⭐', source: 'ETCSL 苏美尔文学文本库', storyId: 'inanna', status: 'ready' },
  { countryId: 'iq', title: '吉尔伽美什与洪水', emoji: '🌊', source: '《吉尔伽美什史诗》第十一块泥板', storyId: 'gilgamesh-flood', status: 'ready' },
  { countryId: 'iq', title: '恩基与宁胡尔萨格', emoji: '💧', source: 'ETCSL 苏美尔文学文本库', storyId: 'enki-ninhursag', status: 'ready' },
  { countryId: 'iq', title: '埃塔纳升天', emoji: '🦅', source: '阿卡德《埃塔纳史诗》', storyId: 'etana', status: 'ready' },
  { countryId: 'ir', title: '鲁斯塔姆七道难关', emoji: '🗡️', source: '菲尔多西《列王纪》', storyId: 'rostam', status: 'ready' },
  { countryId: 'ir', title: '扎哈克与铁匠卡维', emoji: '⛓️', source: '菲尔多西《列王纪》', storyId: 'zahhak', status: 'ready' },
  { countryId: 'ir', title: '神鸟西摩革', emoji: '🦚', source: '菲尔多西《列王纪》', storyId: 'simurgh', status: 'ready' },
  { countryId: 'tr', title: '芦笛之歌·苏菲寓言', emoji: '🎶', source: '鲁米《玛斯纳维》第一卷开篇', storyId: 'reed-flute', status: 'ready' },
  { countryId: 'tr', title: '伊卢延卡与暴风神', emoji: '🐉', source: '赫梯神话楔形文字文本', storyId: 'illuyanka', status: 'ready' },
  { countryId: 'tr', title: '特勒皮努失踪', emoji: '🌾', source: '赫梯《特勒皮努神话》', storyId: 'telipinu', status: 'ready' },
  { countryId: 'sy', title: '巴力与雅姆之战', emoji: '⛈️', source: '乌加里特泥板《巴力史诗》', storyId: 'baal-yam', status: 'ready' },
  { countryId: 'ge', title: '被缚的阿米拉尼', emoji: '⛓️', source: '格鲁吉亚口传史诗《阿米拉尼》', storyId: 'amirani', status: 'ready' },
  { countryId: 'am', title: '哈伊克与贝尔', emoji: '🏹', source: '摩弗西斯·霍列纳齐《亚美尼亚史》', storyId: 'hayk', status: 'ready' },

  // ---------- 希腊 / 南欧 ----------
  { countryId: 'gr', title: '珀耳塞福涅与四季', emoji: '🌸', source: '《荷马颂歌·致德墨忒耳》', storyId: 'persephone', status: 'ready' },
  { countryId: 'gr', title: '普罗米修斯盗火', emoji: '🔥', source: '赫西俄德《神谱》《工作与时日》', storyId: 'prometheus', status: 'ready' },
  { countryId: 'gr', title: '潘多拉的匣子', emoji: '🏺', source: '赫西俄德《工作与时日》', storyId: 'pandora', status: 'ready' },
  { countryId: 'gr', title: '伊卡洛斯之翼', emoji: '🪶', source: '奥维德《变形记》', storyId: 'icarus', status: 'ready' },
  { countryId: 'gr', title: '俄耳甫斯下冥界', emoji: '🎵', source: '奥维德《变形记》', storyId: 'orpheus', status: 'ready' },
  { countryId: 'gr', title: '忒修斯与米诺陶洛斯', emoji: '🐂', source: '阿波罗多洛斯《书库》', storyId: 'theseus', status: 'ready' },
  { countryId: 'it', title: '罗慕路斯与雷穆斯', emoji: '🐺', source: '李维《罗马史》第一卷', storyId: 'romulus', status: 'ready' },
  { countryId: 'it', title: '埃涅阿斯逃离特洛伊', emoji: '⛵', source: '维吉尔《埃涅阿斯纪》', storyId: 'aeneas', status: 'ready' },
  { countryId: 'es', title: '熙德的功业', emoji: '🗡️', source: '《熙德之歌》', storyId: 'elcid', status: 'ready' },
  { countryId: 'fr', title: '罗兰之死', emoji: '⚔️', source: '《罗兰之歌》', storyId: 'roland', status: 'ready' },
  { countryId: 'fr', title: '仙女梅露辛', emoji: '🐍', source: '让·德·阿拉斯《梅露辛传奇》', storyId: 'melusine', status: 'ready' },

  // ---------- 西欧 / 北欧 ----------
  { countryId: 'de', title: '尼伯龙根的宝藏', emoji: '💎', source: '《尼伯龙根之歌》', storyId: 'nibelung', status: 'ready' },
  { countryId: 'de', title: '罗蕾莱', emoji: '🧜', source: '莱茵民间传说 / 海涅诗作', storyId: 'lorelei', status: 'ready' },
  { countryId: 'gb', title: '亚瑟王与石中剑', emoji: '🗡️', source: '马洛里《亚瑟王之死》', storyId: 'arthur-sword', status: 'ready' },
  { countryId: 'gb', title: '贝奥武甫屠妖', emoji: '🐲', source: '古英语史诗《贝奥武甫》', storyId: 'beowulf', status: 'ready' },
  { countryId: 'ie', title: '库胡林的狂战', emoji: '⚔️', source: '《夺牛记》（CELT，UCC）', storyId: 'cuchulainn', status: 'ready' },
  { countryId: 'ie', title: '利尔的天鹅儿女', emoji: '🦢', source: '爱尔兰传统故事《利尔的孩子们》', storyId: 'children-of-lir', status: 'ready' },
  { countryId: 'is', title: '奥丁悬树求符文', emoji: '🌳', source: '《诗体埃达·高人的箴言》', storyId: 'odin-runes', status: 'ready' },
  { countryId: 'is', title: '诸神黄昏', emoji: '⚔️', source: '《诗体埃达·女先知的预言》', storyId: 'ragnarok', status: 'ready' },
  { countryId: 'is', title: '托尔失锤', emoji: '🔨', source: '《诗体埃达·þrymskviða》', storyId: 'thrym', status: 'ready' },
  { countryId: 'is', title: '巴德尔之死', emoji: '🌿', source: '斯诺里《散文埃达》', storyId: 'baldr', status: 'ready' },
  { countryId: 'is', title: '芬里尔巨狼', emoji: '🐺', source: '斯诺里《散文埃达》', storyId: 'fenrir-bound', status: 'ready' },
  { countryId: 'no', title: '尤格林家族的起源', emoji: '👑', source: '斯诺里《海姆斯克林拉·尤格林萨迦》', storyId: 'yngling', status: 'ready' },
  { countryId: 'dk', title: '阿姆莱特复仇', emoji: '💀', source: '萨克索《丹麦人的业绩》', storyId: 'amleth', status: 'ready' },
  { countryId: 'fi', title: '三宝磨', emoji: '⚙️', source: '《卡勒瓦拉》', storyId: 'sampo', status: 'ready' },
  { countryId: 'fi', title: '万奈摩宁的琴', emoji: '🎻', source: '《卡勒瓦拉》', storyId: 'kantele', status: 'ready' },

  // ---------- 东欧 ----------
  { countryId: 'lt', title: '尤拉泰与卡斯提提斯', emoji: '🌊', source: '立陶宛口传传统', storyId: 'jurata', status: 'ready' },
  { countryId: 'pl', title: '瓦维尔巨龙', emoji: '🐉', source: '波兰中世纪编年史传统', storyId: 'wawel', status: 'ready' },
  { countryId: 'ua', title: '基辅建城三兄弟', emoji: '🏰', source: '《往年纪事》', storyId: 'kyiv', status: 'ready' },
  { countryId: 'ro', title: '小羊羔（米奥丽察）', emoji: '🐑', source: '罗马尼亚传统民谣', storyId: 'miorita', status: 'ready' },
  { countryId: 'ru', title: '火鸟与伊万王子', emoji: '🔥', source: '阿法纳西耶夫《俄罗斯民间故事集》', storyId: 'firebird', status: 'ready' },
  { countryId: 'ru', title: '芭芭雅嘎', emoji: '🏚️', source: '阿法纳西耶夫《俄罗斯民间故事集》', storyId: 'babayaga', status: 'ready' },

  // ---------- 非洲 ----------
  { countryId: 'eg', title: '亡灵称心', emoji: '⚖️', source: '《亡灵书》第125章、第30B章', storyId: 'weighing-heart', status: 'ready' },
  { countryId: 'eg', title: '奥西里斯与伊西斯', emoji: '⚱️', source: '《金字塔文》《亡灵书》', storyId: 'osiris', status: 'ready' },
  { countryId: 'eg', title: '拉与太阳之舟', emoji: '🌞', source: '《亡灵书》', storyId: 'ra-barque', status: 'ready' },
  { countryId: 'eg', title: '荷鲁斯与塞特之争', emoji: '🦅', source: '《切斯特·比替纸草》', storyId: 'horus-seth', status: 'ready' },
  { countryId: 'ma', title: '安扎尔求雨', emoji: '🌧️', source: '阿马齐格（柏柏尔）口传传统', storyId: 'anzar', status: 'ready' },
  { countryId: 'ml', title: '松迪亚塔的崛起', emoji: '🦁', source: '曼丁哥口传史诗《松迪亚塔》', storyId: 'sundiata', status: 'ready' },
  { countryId: 'gh', title: '蜘蛛阿南西的智慧', emoji: '🕷️', source: '阿肯族口传传统', storyId: 'anansi', status: 'ready' },
  { countryId: 'ng', title: '奥杜杜瓦与伊费创世', emoji: '🏺', source: '约鲁巴口传传统', storyId: 'oduduwa', status: 'ready' },
  { countryId: 'et', title: '示巴女王与孟尼利克', emoji: '👑', source: '《王之光荣》（Kebra Nagast）', storyId: 'sheba', status: 'ready' },
  { countryId: 'ke', title: '基库尤与穆姆比', emoji: '🌳', source: '基库尤口传传统', storyId: 'gikuyu', status: 'ready' },
  { countryId: 'za', title: '乌恩库伦库鲁造人', emoji: '🌾', source: '祖鲁口传传统', storyId: 'unkulunkulu', status: 'ready' },

  // ---------- 美洲 ----------
  { countryId: 'us', title: '郊狼偷火', emoji: '🐺', source: '北美原住民口传传统', storyId: 'coyote-fire', status: 'ready' },
  { countryId: 'us', title: '雷鸟', emoji: '🦅', source: '太平洋西北海岸原住民口传传统', storyId: 'thunderbird', status: 'ready' },
  { countryId: 'ca', title: '大乌鸦造世界', emoji: '🪶', source: '海达族口传传统', storyId: 'raven', status: 'ready' },
  { countryId: 'mx', title: '五个太阳纪', emoji: '🌞', source: '《墨西加编年史》/太阳石碑', storyId: 'five-suns', status: 'ready' },
  { countryId: 'mx', title: '羽蛇神下凡', emoji: '🐍', source: '《佛罗伦丁手抄本》', storyId: 'quetzalcoatl', status: 'ready' },
  { countryId: 'gt', title: '波波尔·乌双子英雄', emoji: '🌽', source: '基切玛雅《波波尔·乌》', storyId: 'popolvuh', status: 'ready' },
  { countryId: 'co', title: '黄金国与瓜塔维塔湖', emoji: '💧', source: '穆伊斯卡口传与西班牙编年史', storyId: 'el-dorado', status: 'ready' },
  { countryId: 'pe', title: '印蒂之子建库斯科', emoji: '🌞', source: '印卡·加西拉索《印卡王室述评》', storyId: 'manco', status: 'ready' },
  { countryId: 'br', title: '森林守护者库鲁皮拉', emoji: '🌳', source: '图皮-瓜拉尼口传传统', storyId: 'curupira', status: 'ready' },
  { countryId: 'cl', title: '特雷恩特雷恩与凯凯', emoji: '🌊', source: '马普切口传传统', storyId: 'trengtreng', status: 'ready' },

  // ---------- 大洋洲 ----------
  { countryId: 'au', title: '彩虹蛇', emoji: '🌈', source: '原住民梦创时代口传传统', storyId: 'rainbow-serpent', status: 'ready' },
  { countryId: 'au', title: '七姐妹之歌', emoji: '✨', source: '原住民口传传统', storyId: 'seven-sisters', status: 'ready' },
  { countryId: 'nz', title: '毛伊钓起大鱼', emoji: '🎣', source: '毛利口传传统', storyId: 'maui', status: 'ready' },
  { countryId: 'nz', title: '兰吉与帕帕的分离', emoji: '☁️', source: '毛利创世口传传统', storyId: 'rangi-papa', status: 'ready' },
]

/** 每个国家的故事数，按数量倒序（对齐参考产品右侧列表） */
export function countryStats() {
  return catalogCountries
    .map((c) => {
      const all = catalogStories.filter((s) => s.countryId === c.id)
      return {
        ...c,
        total: all.length,
        ready: all.filter((s) => s.status === 'ready').length,
      }
    })
    .sort((a, b) => b.total - a.total || b.ready - a.ready)
}

export function storiesOfCountry(countryId: string) {
  return catalogStories.filter((s) => s.countryId === countryId)
}

export const totalStoryCount = catalogStories.length
export const totalCountryCount = catalogCountries.length
export const readyStoryCount = catalogStories.filter((s) => s.status === 'ready').length
