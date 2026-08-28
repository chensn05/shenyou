// 神游 · 手绘像素精灵（32×32 精细版）
//
// 每个精灵是 32×32 点阵：rows 里一个字符 = 一个像素，'.' 表示透明，
// 其余字符查 palette 取色。平涂 + 描边 + 细剪影，避免 16×16 的大颗粒。

export interface SpriteDef {
  palette: Record<string, string>
  rows: string[]
}

const OUT = '#3B2A1A'

// ---- 星芽调色板 ----
const plantPalette = {
  o: OUT,
  p: '#C9835A', P: '#E3A87C', q: '#A2653F',
  s: '#6B4A2E', S: '#83603E',
  g: '#6FA85A', G: '#97C877',
  t: '#5C8F4A',
  k: '#8A5A3A', K: '#B57B4F',
  f: '#F2A0B8', F: '#FFD1E0',
  y: '#F5D06A', w: '#FFFFFF',
}

// ---- 精卫调色板（文首、白喙、赤足）----
const birdPalette = {
  o: OUT,
  d: '#3C4A63', D: '#5C6E8E',
  w: '#F5F5F0', W: '#D8D4CC',
  r: '#C0392B', e: '#1A1A1A', S: '#9AA0A6',
}

// ---- 白兔调色板 ----
const rabbitPalette = {
  o: OUT,
  w: '#F7F5F0', W: '#D8D4CC',
  n: '#F0A8B8', e: '#C0392B',
  g: '#6FA85A', G: '#97C877', s: '#6B4A2E',
}

// ---- 幼狼调色板 ----
const wolfPalette = {
  o: OUT,
  a: '#7A8290', A: '#A6AEBB',
  e: '#E8C34A', n: '#2A2A2A',
}

// ============ 共用花盆（第 22~31 行）============
const POT = [
  '....oooooooooooooooooooooooo....',
  '....oPPPPPPPPPPPPPPPPPPPPPPo....',
  '.....osssssssssssssssssssso...',
  '.....oppppppppppppppppppppo...',
  '.....oppppppppppppppppppppo...',
  '......oppppppppppppppppppo......',
  '......oppppppppppppppppppo......',
  '.......opppppppppppppppppo.......',
  '........oqqqqqqqqqqqqqqo........',
  '.........oooooooooooooo.........',
]

const E32 = '................................'
function empty(n: number) { return Array.from({ length: n }, () => E32) }

// ============ 星芽 ============
export const XINGYA_STAGES: SpriteDef[] = [
  // 1 种子
  {
    palette: plantPalette,
    rows: [
      ...empty(19),
      '...............oo...............',
      '..............okko..............',
      '..............okko..............',
      ...POT,
    ],
  },
  // 2 嫩芽
  {
    palette: plantPalette,
    rows: [
      ...empty(12),
      '.........o............o.........',
      '.........oGGGGottoGGGGo.........',
      '........oGGGGGottoGGGGGo........',
      '........oGGGGGottoGGGGGo........',
      '.........oGGGGottoGGGGo.........',
      '...........oGGottoGGo...........',
      '...............tt...............',
      '...............tt...............',
      '...............tt...............',
      '...............tt...............',
      ...POT,
    ],
  },
  // 3 舒展
  {
    palette: plantPalette,
    rows: [
      ...empty(7),
      '...............oo...............',
      '..............offo..............',
      '..........o..........o..........',
      '...........oGGottoGGo...........',
      '.........oGGGGottoGGGGo.........',
      '...........oGGottoGGo...........',
      '...............tt...............',
      '...............tt...............',
      '........o..............o........',
      '........oGGGGGottoGGGGGo........',
      '........oGGGGGottoGGGGGo........',
      '.........oGGGGottoGGGGo.........',
      '...............tt...............',
      '...............tt...............',
      '...............tt...............',
      ...POT,
    ],
  },
  // 4 绽放
  {
    palette: plantPalette,
    rows: [
      E32,
      '.....y....................y.....',
      '...............oo...............',
      '..............offfo..............',
      '.............offFFfo.............',
      '............ofFwwFfo............',
      '.............offFFfo.............',
      '..............offfo..............',
      '...............oo...............',
      '...............tt...............',
      '...............tt...............',
      '...............tt...............',
      '...............tt...............',
      '...............tt...............',
      '........o..............o........',
      '........oGGGGGottoGGGGGo........',
      '........oGGGGGottoGGGGGo........',
      '.........oGGGGottoGGGGo.........',
      '...............tt...............',
      '...............tt...............',
      '...............tt...............',
      '...............tt...............',
      ...POT,
    ],
  },
]

// ============ 精卫 ============
export const JINGWEI_STAGES: SpriteDef[] = [
  // 1 卵
  {
    palette: birdPalette,
    rows: [
      ...empty(8),
      '.............oooo.............',
      '............owwwwo............',
      '...........owwwwwwo...........',
      '..........owwwwwwwwo..........',
      '..........owwSwwwwwwo..........',
      '..........owwwwwwwwwo..........',
      '..........owwwwwSwwwo..........',
      '..........owwwwwwwwwo..........',
      '..........owwwwSwwwwo..........',
      '..........owwwwwwwwwo..........',
      '..........oWwwwwwwWo..........',
      '..........oWWwwwwwWo..........',
      '...........oWWWWWwo...........',
      '............oooooo............',
      ...empty(10),
    ],
  },
  // 2 雏鸟
  {
    palette: birdPalette,
    rows: [
      ...empty(10),
      '............oooo..............',
      '...........oddddo.............',
      '..........oddddddo............',
      '.........odddeddddo...........',
      '.........oddddddddo...........',
      '.........oddddddwwwo..........',
      '.........oddddddddwo..........',
      '.........oddddddddo...........',
      '..........oddddddo............',
      '...........oddddo.............',
      '...........orr.orr............',
      '...........o....o.............',
      ...empty(10),
    ],
  },
  // 3 振翅（第 4 阶段复用本图 + 金色光环）
  {
    palette: birdPalette,
    rows: [
      ...empty(8),
      '............oooo..............',
      '...........oddddo.............',
      '..........oddddddo............',
      '..........odddedddo...........',
      '....oo....oddddddwwwo....oo...',
      '...oDDDo..oddddddddo..oDDDo...',
      '..oDDDDDo.oddddddddo.oDDDDDo..',
      '..oDDDDDo..oddddddo..oDDDDDo..',
      '....oDDo....odddddo...oDDo....',
      '..........oddddddo............',
      '...........oddddo.............',
      '...........orro...............',
      '...........o..o...............',
      ...empty(11),
    ],
  },
]

// ============ 白兔 ============
export const INABA_STAGES: SpriteDef[] = [
  // 1 草丛
  {
    palette: rabbitPalette,
    rows: [
      ...empty(15),
      '......o......o......o......o....',
      '.....ogo....ogo....ogo....ogo...',
      '.....oggo...oggo...oggo...oggo..',
      '....ogggo..ogggo..ogggo..ogggo..',
      '....oGggo..oGggo..oGggo..oGggo..',
      '...ogGGgo..ogGGgo..ogGGgo..ogGGgo.',
      '...oGGGgo..oGGGgo..oGGGgo..oGGGo.',
      '..ogGGGgo.ogGGGgo.ogGGGgo.ogGGgo..',
      '..oGGGGGGGGGGGGGGGGGGGGGGGGGGGo..',
      '..ossssssssssssssssssssssssssso..',
      '..ossssssssssssssssssssssssssso..',
      '..ooooooooooooooooooooooooooooo..',
      ...empty(5),
    ],
  },
  // 2 幼兔
  {
    palette: rabbitPalette,
    rows: [
      ...empty(6),
      '..........oo......oo..........',
      '..........onno....onno..........',
      '..........onno....onno..........',
      '..........owwo....owwo..........',
      '..........owwo....owwo..........',
      '..........owwo....owwo..........',
      '..........owwo....owwo..........',
      '.........oooooooooooo.........',
      '........owwwwwwwwwwo........',
      '........owwewwwewwwo........',
      '........owwwwwwwwwwo........',
      '........owwwwnnwwwwo........',
      '........owwwwwwwwwwo........',
      '.........owwwwwwwwo.........',
      '........owwwwwwwwwwo........',
      '........owwwwwwwwwwo........',
      '.........oooooooooo.........',
      ...empty(9),
    ],
  },
  // 3 白兔（第 4 阶段复用本图 + 光环）
  {
    palette: rabbitPalette,
    rows: [
      ...empty(6),
      '..........oo......oo..........',
      '..........onno....onno..........',
      '..........onno....onno..........',
      '..........owwo....owwo..........',
      '..........owwo....owwo..........',
      '..........owwo....owwo..........',
      '..........owwo....owwo..........',
      '.........oooooooooooo.........',
      '........owwwwwwwwwwo........',
      '........owwewwwewwwo........',
      '........owwwwwwwwwwo........',
      '........owwwwnnwwwwo........',
      '........owwwwwwwwwwo........',
      '.......owwwwwwwwwwwwo.......',
      '.......owwwwwwwwwwwwo.......',
      '......owwWwwwwwwwwWwwo......',
      '.......owwwwwwwwwwwwo.......',
      '........oooooooooooo........',
      ...empty(7),
    ],
  },
]

// ============ 幼狼 ============
export const FENRIR_STAGES: SpriteDef[] = [
  // 1 足迹
  {
    palette: wolfPalette,
    rows: [
      ...empty(8),
      '........oo........oo........',
      '.......oaao......oaao.......',
      '.......oaao......oaao.......',
      '........oo........oo........',
      '....oo................oo....',
      '...oaao..............oaao...',
      '....oo................oo....',
      E32,
      '...........oooooo...........',
      '..........oaaaaaao..........',
      '.........oaaaaaaaao.........',
      '.........oaaaaaaaao.........',
      '..........oaaaaaao..........',
      '...........oooooo...........',
      ...empty(10),
    ],
  },
  // 2 幼狼
  {
    palette: wolfPalette,
    rows: [
      ...empty(8),
      '.........oo........oo.........',
      '.........oao......oao.........',
      '.........oao......oao.........',
      '........oaaoo....ooaao........',
      '........oaaaaaaaaaaao........',
      '........oaeaaaaaaaeao........',
      '........oaaaaaaaaaaao........',
      '.........oaaaaaaaao.........',
      '..........oaaaaaao..........',
      '..........oaaanaao..........',
      '...........oaanao...........',
      '............oanno............',
      '.............oao.............',
      '.........oaaaaaaaao.........',
      '........oaaaaaaaaaao........',
      '........oaaAaaaaAaaao........',
      '.........oo......oo.........',
      ...empty(7),
    ],
  },
  // 3 成狼（第 4 阶段复用本图 + 光环）
  {
    palette: wolfPalette,
    rows: [
      ...empty(6),
      '........oo..........oo........',
      '.......oao........oao.......',
      '.......oaao......oaao.......',
      '......oaaaooooooooaaao......',
      '......oaaaaaaaaaaaaaao......',
      '......oaeaaaaaaaaaaeao......',
      '......oaaaaaaaaaaaaaao......',
      '.......oaaaaaaaaaaao.......',
      '........oaaaaaaaaao........',
      '.........oaaaaaaao..........',
      '.........oaaanaaao..........',
      '..........oaannao...........',
      '...........oannno...........',
      '............oano............',
      '.......oaaaaaaaaaao.........',
      '......oaaaaaaaaaaaao........',
      '......oaaAaaaaaaaaAao.......',
      '......oaaaaaaaaaaaao........',
      '.......oo...oo...oo.........',
      '.......oo...oo...oo.........',
      ...empty(6),
    ],
  },
]

/** 伙伴 id → 各阶段精灵；不足 4 个时最后一阶段复用最后一张图（配合光环） */
export const SPRITES: Record<string, SpriteDef[]> = {
  xingya: XINGYA_STAGES,
  jingwei: JINGWEI_STAGES,
  inaba: INABA_STAGES,
  fenrir: FENRIR_STAGES,
}

// ============================================================
// 萌宠体系：模板化像素品种
// 体型模板提供剪影与五官槽位，品种只提供调色板（含斑纹槽位）
// ============================================================

type PetTemplate = 'cat' | 'dogFloppy' | 'dogPointy' | 'longdog' | 'flatdog'

export interface PetBreed {
  id: string
  name: string
  kind: 'cat' | 'dog'
  /** N 默认可选 / R 读满 5 篇 / SR 读满 12 篇 */
  rarity: 'N' | 'R' | 'SR'
  template: PetTemplate
  palette: Record<string, string>
  /** 阅读篇数达到该值解锁；无则默认可用 */
  unlockProgress?: number
}

const PET_TEMPLATES: Record<PetTemplate, string[]> = {
  // 猫：尖耳、瘦削、尾巴绕前；k=面罩耳尖（暹罗用），b=背纹（橘猫斑纹用）
  cat: [
    '................................',
    '..........oo......oo..........',
    '..........okko....okko........',
    '..........okio....oiko........',
    '........okimooooooomiko........',
    '........ommmmmmmmmmmmmo........',
    '.......omkkkmmmmmmkkko........',
    '.......omkkkommmmokkko........',
    '.......omkkkmmmmmmkkko........',
    '........omkkannaaakmo..........',
    '........omkmmaaaammko..........',
    '.........ommmmmmmmmmo...........',
    '.........ommmmmmmmmmmmo..........',
    '........ommmmmmmmmmmmmmo.........',
    '........ommmmaaaaaammmmo........',
    '........ommmmaaaaaammmmo........',
    '........ommmmaaaaaammmmo........',
    '.......ommmmmmaaaaammmmmmo.......',
    '.......ommmmmmaaaaammmmmmo.......',
    '.......ommmmmmaaaaammmmmmo.......',
    '.......ommmmbbbbbbbbbbbbo.......',
    '.......ommmmmmmmmmmmmmmmo..oo....',
    '.......ommmmmmmmmmmmmmmmo.ommo....',
    '.......ommmmmmmmmmmmmmmmo.ommmmo...',
    '.......ommmmmmmmmmmmmmmmo.ommmmo...',
    '.......ommmmmmmmmmmmmmmmo..ommo....',
    '........ommmmmooommmmmmo....oo.....',
    '........ookmoo.oommookmo.........',
    '.........oooo...ooooooo...........',
    '................................',
    '................................',
  ],
  // 垂耳狗：头圆无尖耳，两条长垂耳从头的两侧挂到下颌以下
  dogFloppy: [
    '................................',
    '................................',
    '..........oooooooooo............',
    '.........ommmmmmmmmmo............',
    '........ommmmmmmmmmmmmo..........',
    '......oommmmmmmmmmmmmmo..........',
    '.....ommoommmmmmmmmmmoommo.......',
    '.....ommo.ommemmmemmo.ommo.......',
    '.....ommo.ommmmmmmmmmo.ommo.......',
    '.....ommo.ommmonnaammo.ommo.......',
    '.....ommo.ommmaaaaaammo.ommo......',
    '.....ommo.ommmmmmmmmmo.ommo.......',
    '......ommo.ommmmmmmmmo.ommo.......',
    '......ommo.ommmmmmmmmmo.ommo......',
    '.......oo..ommmmmmmmmmo..oo.......',
    '..........ommmmmmmmmmmmmo.........',
    '.........ommmmmaaaaaammmmmo.......',
    '.........ommmmmaaaaaammmmmo.......',
    '........ommmmmmaaaaaammmmmmo......',
    '........ommmmmmaaaaaammmmmmo......',
    '........ommmmmmmmmmmmmmmmmmo..oo..',
    '........ommmmmmmmmmmmmmmmmmo.ommo.',
    '.........ommmmmmmmmmmmmmmo..omo...',
    '.........oommmmmooommmmmmo........',
    '..........oommoo.oommooommo......',
    '...........oooo...ooooooo........',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
  ],
  // 立耳狗：尖耳但吻部宽、脸颊厚、尾巴在背上卷成圈、腿更短
  dogPointy: [
    '................................',
    '..........oo......oo..........',
    '..........ommo....ommo........',
    '..........omio....oimo........',
    '........omimooooooomimo........',
    '........ommmmmmmmmmmmmo........',
    '.......ommmmmmmmmmmmmmmo........',
    '.......ommeommmmoemmmo........',
    '.......ommmmmmmmmmmmmmo........',
    '........omaaannnaaammo..........',
    '........ommaaaaaaaammo..........',
    '........ommmmmmmmmmmmmmo........',
    '.......ommmmmmmmmmmmmmmmo.......',
    '......ommmmmmmmmmmmmmmmmmo......',
    '......ommmmmaaaaaammmmoo..oo....',
    '......ommmmmaaaaaammmmoo.ommo...',
    '.....ommmmmmaaaaaammmmmmo.ommmo..',
    '.....ommmmmmaaaaaammmmmmo.ommmmo.',
    '.....ommmmmmmmmmmmmmmmmmo..ommo..',
    '.....ommmmmmmmmmmmmmmmmmo...oo...',
    '......ommmmmmmmmmmmmmmmmmo.......',
    '......ommmmmmoooommmmmmmmo.......',
    '.......oommo...oommooommo........',
    '.........oo....ooooooooo.........',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
  ],
  // 腊肠：全身侧面，长躯干，四条短腿，尾巴上翘
  longdog: [
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '............................oo..',
    '...........................ommo.',
    '...........................ommo.',
    '.....oo.....................o...',
    '....ommmo........................',
    '....ommmo........................',
    '....ommmmo.......................',
    '...ommeemmo......................',
    '...ommmmammo.....................',
    '..ommmaaaaamo....................',
    '..onmmmaaaamo....................',
    '...ommmmmmmo.....................',
    '....ommmmmmo.....................',
    '...ommmmmmmmmmmmmmmmmmmmmmmmmmmo.',
    '...ommmmaaaaaaaaaaaaaaaaaammmmmo.',
    '...ommmmmmmmmmmmmmmmmmmmmmmmmmmo.',
    '.....ommmoommooommooommooommo...',
    '.....oo..oo..oo...oo..oo........',
    '.....oo..oo..oo...oo..oo........',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
  ],
  // 巴哥：小三角垂耳、扁脸、大面积深色面罩
  flatdog: [
    '................................',
    '......ooo..........ooo..........',
    '.....ommmo........ommmo.........',
    '.....ommmo......ommmo...........',
    '......ommmooooooommmmo..........',
    '......ommmmmmmmmmmmmmmo.........',
    '......ommmmmmmmmmmmmmmo.........',
    '......ommeokkkkkoemmmo..........',
    '......ommmkkkkkkkmmmmmo.........',
    '......ommmkknnnkkmmmmmo.........',
    '......ommmkkkkkkkmmmmmo.........',
    '.......ommmmmmmmmmmmmo..........',
    '......ommmmmmmmmmmmmmmmmo........',
    '......ommmmmmaaaaaammmmmo........',
    '......ommmmmmaaaaaammmmmo........',
    '......ommmmmmaaaaaammmmmo........',
    '.....ommmmmaaaaaaaammmmmmo.......',
    '.....ommmmmmmmmmmmmmmmmmmo.......',
    '......ommmmmmmoommmmmmmo.........',
    '......oommoo.oommooommo..........',
    '.......oooo...ooooooo............',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
  ],
}

const PET_BASE = { o: '#3B2A1A', e: '#1A1A1A', n: '#2A2A2A', i: '#F0A8B8' }

export const PET_BREEDS: PetBreed[] = [
  // ---------- N：默认可选 ----------
  { id: 'jucat', name: '橘猫', kind: 'cat', rarity: 'N', template: 'cat',
    palette: { ...PET_BASE, m: '#E8912D', a: '#F5D6A8', k: '#E8912D', b: '#B96A1A' } },
  { id: 'tuxedo', name: '奶牛猫', kind: 'cat', rarity: 'N', template: 'cat',
    palette: { ...PET_BASE, m: '#3A3A3A', a: '#FFFFFF', k: '#3A3A3A', b: '#3A3A3A' } },
  { id: 'golden', name: '金毛', kind: 'dog', rarity: 'N', template: 'dogFloppy',
    palette: { ...PET_BASE, m: '#C08A3E', a: '#EDD9AE', k: '#C08A3E', b: '#C08A3E' } },
  { id: 'teddy', name: '泰迪', kind: 'dog', rarity: 'N', template: 'dogFloppy',
    palette: { ...PET_BASE, m: '#A9744C', a: '#D9B48C', k: '#A9744C', b: '#A9744C' } },
  { id: 'shiba', name: '柴犬', kind: 'dog', rarity: 'N', template: 'dogPointy',
    palette: { ...PET_BASE, m: '#B55B2B', a: '#F5E6CC', k: '#B55B2B', b: '#B55B2B' } },
  { id: 'corgi', name: '柯基', kind: 'dog', rarity: 'N', template: 'dogPointy',
    palette: { ...PET_BASE, m: '#C96F2E', a: '#F8F2E4', k: '#C96F2E', b: '#C96F2E' } },
  // ---------- R：读满 5 篇 ----------
  { id: 'bluecat', name: '蓝猫', kind: 'cat', rarity: 'R', template: 'cat', unlockProgress: 5,
    palette: { ...PET_BASE, m: '#7A8BA8', a: '#C8D4E0', k: '#7A8BA8', b: '#7A8BA8' } },
  { id: 'siamese', name: '暹罗猫', kind: 'cat', rarity: 'R', template: 'cat', unlockProgress: 5,
    palette: { ...PET_BASE, m: '#E8DCC8', a: '#F2EADA', k: '#5E4438', b: '#5E4438' } },
  { id: 'lab', name: '拉布拉多', kind: 'dog', rarity: 'R', template: 'dogFloppy', unlockProgress: 5,
    palette: { ...PET_BASE, m: '#E8D3A0', a: '#F5E8CC', k: '#E8D3A0', b: '#E8D3A0' } },
  { id: 'beagle', name: '比格犬', kind: 'dog', rarity: 'R', template: 'dogFloppy', unlockProgress: 5,
    palette: { ...PET_BASE, m: '#B57B4F', a: '#FFFFFF', k: '#B57B4F', b: '#3A2E22' } },
  { id: 'husky', name: '哈士奇', kind: 'dog', rarity: 'R', template: 'dogPointy', unlockProgress: 5,
    palette: { ...PET_BASE, m: '#8A97A8', a: '#FFFFFF', k: '#3A4550', b: '#8A97A8' } },
  // ---------- SR：读满 12 篇 ----------
  { id: 'calico', name: '三花猫', kind: 'cat', rarity: 'SR', template: 'cat', unlockProgress: 12,
    palette: { ...PET_BASE, m: '#E8912D', a: '#F8E8D0', k: '#E8912D', b: '#3A3A3A' } },
  { id: 'pug', name: '巴哥犬', kind: 'dog', rarity: 'SR', template: 'flatdog', unlockProgress: 12,
    palette: { ...PET_BASE, m: '#C9B294', a: '#E0D3BC', k: '#5A4A3A', b: '#C9B294' } },
  { id: 'dachshund', name: '腊肠犬', kind: 'dog', rarity: 'SR', template: 'longdog', unlockProgress: 12,
    palette: { ...PET_BASE, m: '#7A4A2E', a: '#C98A5A', k: '#7A4A2E', b: '#7A4A2E' } },
  { id: 'minipin', name: '小鹿犬', kind: 'dog', rarity: 'SR', template: 'dogPointy', unlockProgress: 12,
    palette: { ...PET_BASE, m: '#8A5A3A', a: '#D9A45B', k: '#8A5A3A', b: '#8A5A3A' } },
]

export function getBreed(id: string) {
  return PET_BREEDS.find((b) => b.id === id)
}

/** 品种精灵：模板行 + 品种调色板，行数统一补齐 32 */
export function spriteForBreed(id: string): SpriteDef {
  const b = getBreed(id)
  if (!b) return XINGYA_STAGES[0]
  const rows = [...PET_TEMPLATES[b.template]]
  while (rows.length < 32) rows.push(E32)
  return normalize({ palette: b.palette, rows: rows.slice(0, 32) })
}

/** 归一化：把每行居中填充/裁切到 32 列、把行数填充到 32 行 */
function normalize(def: SpriteDef): SpriteDef {
  const rows = def.rows.map((r) => {
    if (r.length === 32) return r
    if (r.length > 32) {
      const start = Math.floor((r.length - 32) / 2)
      return r.slice(start, start + 32)
    }
    const pad = 32 - r.length
    const left = Math.floor(pad / 2)
    return E32.slice(0, left) + r + E32.slice(0, pad - left)
  })
  while (rows.length < 32) rows.push(E32)
  return { ...def, rows: rows.slice(0, 32) }
}

export function spriteFor(companionId: string, stageIdx: number): SpriteDef {
  const list = SPRITES[companionId] || XINGYA_STAGES
  return normalize(list[Math.min(stageIdx, list.length - 1)])
}
