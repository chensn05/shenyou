// 神游 · 文化圈与地心分层配置
// 每个文化圈的分层严格对应该文化自身的宇宙观，不强行统一。

export interface Layer {
  name: string
  colorFrom: string
  colorTo: string
}

export interface Culture {
  id: string
  label: string
  lat: number
  lon: number
  layers: Layer[]
  ready: boolean // 是否已有完整人物/故事内容
}

export const cultures: Culture[] = [
  {
    id: 'china',
    label: '中国',
    lat: 34,
    lon: 108,
    layers: [
      { name: '天界层', colorFrom: '#F7E6B8', colorTo: '#E9CE86' },
      { name: '神域层（昆仑）', colorFrom: '#D8E7D6', colorTo: '#B7CFB2' },
      { name: '人间层（九州）', colorFrom: '#EADFC8', colorTo: '#D6C4A0' },
      { name: '幽都层', colorFrom: '#9FB0BE', colorTo: '#758294' },
    ],
    ready: true,
  },
  {
    id: 'japan',
    label: '日本',
    lat: 36,
    lon: 138,
    layers: [
      { name: '高天原', colorFrom: '#F5E9C8', colorTo: '#E6D19A' },
      { name: '海原', colorFrom: '#C9DDE6', colorTo: '#9CC0D0' },
      { name: '苇原中国', colorFrom: '#E6DCC4', colorTo: '#CDB98F' },
      { name: '黄泉国', colorFrom: '#8E97AC', colorTo: '#63697E' },
    ],
    ready: true,
  },
  {
    id: 'india',
    label: '印度',
    lat: 22,
    lon: 79,
    layers: [
      { name: '梵天界', colorFrom: '#F3DFB0', colorTo: '#E0BE72' },
      { name: '天界（因陀罗）', colorFrom: '#BFD8E0', colorTo: '#8FB9C6' },
      { name: '人间界', colorFrom: '#E4D6B8', colorTo: '#CDB187' },
      { name: '地下界（那伽）', colorFrom: '#7E9A87', colorTo: '#5B7563' },
    ],
    ready: true,
  },
  {
    id: 'mesopotamia',
    label: '两河流域',
    lat: 33,
    lon: 44,
    layers: [
      { name: '天界（安努）', colorFrom: '#F0DCA8', colorTo: '#DBB86A' },
      { name: '大地层（恩利尔）', colorFrom: '#E4D6B0', colorTo: '#C7B379' },
      { name: '深渊层（恩基）', colorFrom: '#B9CBD4', colorTo: '#8AA6B3' },
      { name: '冥界层（埃列什基伽勒）', colorFrom: '#7C879B', colorTo: '#565F72' },
    ],
    ready: true,
  },
  {
    id: 'greek',
    label: '希腊',
    lat: 39,
    lon: 22,
    layers: [
      { name: '至高神层', colorFrom: '#F7E6B8', colorTo: '#E9CE86' },
      { name: '神域层', colorFrom: '#E4E9D2', colorTo: '#C9D6AE' },
      { name: '人间层', colorFrom: '#EADFC8', colorTo: '#D6C4A0' },
      { name: '冥界层', colorFrom: '#B9C4CE', colorTo: '#8E9CAC' },
    ],
    ready: true,
  },
  {
    id: 'norse',
    label: '北欧',
    lat: 60,
    lon: 15,
    layers: [
      { name: '阿斯加德', colorFrom: '#F3E3AE', colorTo: '#DFC479' },
      { name: '华纳海姆', colorFrom: '#E8D77E', colorTo: '#CDB454' },
      { name: '米德加尔德', colorFrom: '#B9D2B0', colorTo: '#8FB482' },
      { name: '约顿海姆', colorFrom: '#AFC9D6', colorTo: '#7FA3B4' },
      { name: '赫尔海姆', colorFrom: '#6E7C93', colorTo: '#4B566A' },
    ],
    ready: true,
  },
]

export function getCulture(id: string) {
  return cultures.find((c) => c.id === id)
}
