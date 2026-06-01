import type { FurnitureItem } from '../types'

export const FURNITURE_DATA: FurnitureItem[] = [
  { id: 'sofa', name: '沙发', emoji: '🛋️', room: 'living', x: 7, y: 44, width: 11, height: 17 },
  { id: 'coffee_table', name: '茶几', emoji: '☕', room: 'living', x: 12, y: 37, width: 10, height: 9 },
  { id: 'dining_table', name: '餐桌', emoji: '🍽️', room: 'living', x: 27, y: 62, width: 16, height: 9 },
  { id: 'tv', name: '电视', emoji: '📺', room: 'living', x: 32, y: 46, width: 10, height: 12 },
  { id: 'fridge', name: '冰箱', emoji: '🧊', room: 'kitchen', x: 72, y: 65, width: 12, height: 6 },
  { id: 'stove', name: '灶台', emoji: '🔥', room: 'kitchen', x: 81, y: 55, width: 10, height: 14 },
  { id: 'bed', name: '双人床', emoji: '🛏️', room: 'bedroom', x: 8, y: 7, width: 18, height: 16 },
  { id: 'wardrobe', name: '衣柜', emoji: '👚', room: 'bedroom', x: 24, y: 5, width: 15, height: 7 },
  { id: 'desk', name: '书桌', emoji: '📚', room: 'study', x: 79, y: 5, width: 10, height: 15 },
  { id: 'chair', name: '椅子', emoji: '🪑', room: 'study', x: 68, y: 9, width: 6, height: 6 },
  { id: 'computer', name: '电脑', emoji: '💻', room: 'study', x: 74, y: 18, width: 11, height: 7 },
  { id: 'washing_machine', name: '洗衣机', emoji: '🧺', room: 'bathroom', x: 71, y: 33, width: 9, height: 6 },
  { id: 'bathtub', name: '浴缸', emoji: '🛁', room: 'bathroom', x: 82, y: 35, width: 12, height: 12 },
  { id: 'toilet', name: '马桶', emoji: '🚽', room: 'bathroom', x: 58, y: 40, width: 7, height: 7 },
  { id: 'message_wall', name: '留言墙', emoji: '📝', room: 'hallway', x: 16, y: 81, width: 8, height: 7 },
  { id: 'shoe_cabinet', name: '鞋柜', emoji: '👟', room: 'hallway', x: 43, y: 83, width: 14, height: 6 },
  { id: 'plant', name: '绿植', emoji: '🪴', room: 'hallway', x: 55, y: 79, width: 11, height: 7 },
]

export const INTERACTIVE_FURNITURE = new Set([
  'sofa',
  'coffee_table',
  'dining_table',
  'tv',
  'fridge',
  'stove',
  'bed',
  'wardrobe',
  'desk',
  'chair',
  'computer',
  'washing_machine',
  'bathtub',
  'toilet',
  'message_wall',
  'shoe_cabinet',
  'plant',
])

export const FURNITURE_NAMES: Record<string, string> = Object.fromEntries(
  FURNITURE_DATA.map((f) => [f.id, f.name])
)
