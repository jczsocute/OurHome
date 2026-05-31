import type { FurnitureItem } from '../types'

export const FURNITURE_DATA: FurnitureItem[] = [
  { id: 'sofa', name: '沙发', emoji: '🛋️', room: 'living', x: 8, y: 44, width: 12, height: 16 },
  { id: 'coffee_table', name: '茶几', emoji: '☕', room: 'living', x: 14, y: 34, width: 10, height: 8 },
  { id: 'dining_table', name: '餐桌', emoji: '🍽️', room: 'living', x: 28, y: 62, width: 16, height: 8 },
  { id: 'fridge', name: '冰箱', emoji: '🧊', room: 'kitchen', x: 64, y: 64, width: 10, height: 7 },
  { id: 'stove', name: '灶台', emoji: '🔥', room: 'kitchen', x: 81, y: 55, width: 11, height: 14 },
  { id: 'bed', name: '双人床', emoji: '🛏️', room: 'bedroom', x: 8, y: 8, width: 20, height: 14 },
  { id: 'desk', name: '书桌', emoji: '📚', room: 'study', x: 80, y: 7, width: 10, height: 14 },
  { id: 'chair', name: '椅子', emoji: '🪑', room: 'study', x: 65, y: 9, width: 7, height: 7 },
  { id: 'washing_machine', name: '洗衣机', emoji: '🧺', room: 'bathroom', x: 65, y: 34, width: 8, height: 8 },
  { id: 'bathtub', name: '浴缸', emoji: '🛁', room: 'bathroom', x: 78, y: 38, width: 14, height: 10 },
  { id: 'message_wall', name: '留言墙', emoji: '📝', room: 'hallway', x: 20, y: 80, width: 10, height: 7 },
]

export const INTERACTIVE_FURNITURE = new Set([
  'sofa',
  'coffee_table',
  'dining_table',
  'fridge',
  'stove',
  'bed',
  'desk',
  'chair',
  'washing_machine',
  'bathtub',
  'message_wall',
])
