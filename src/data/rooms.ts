export interface RoomData {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
}

export const ROOMS: RoomData[] = [
  { id: 'bedroom', label: '卧室', x: 2, y: 2, w: 48, h: 26 },
  { id: 'study', label: '书房', x: 52, y: 2, w: 46, h: 26 },
  { id: 'living', label: '客厅', x: 2, y: 30, w: 54, h: 44 },
  { id: 'bathroom', label: '浴室', x: 58, y: 30, w: 40, h: 20 },
  { id: 'kitchen', label: '厨房', x: 58, y: 52, w: 40, h: 22 },
  { id: 'hallway', label: '走廊', x: 2, y: 76, w: 96, h: 14 },
]

export const ROOM_BG: Record<string, string> = {
  living: '#FFF8F0',
  kitchen: '#FFF5EC',
  bedroom: '#FFF0F3',
  study: '#F0F4FF',
  bathroom: '#ECF8F8',
  hallway: '#FFFEF5',
}
