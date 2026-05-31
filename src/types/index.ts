export interface Diary {
  id: string
  title: string
  date: string
  location: string
  tags: string[]
  relatedObject: string
  content: string
}

export interface Theater {
  id: string
  title: string
  date: string
  content: string
}

export interface Message {
  id: string
  name: string
  content: string
  createdAt: string
}

export interface FurnitureItem {
  id: string
  name: string
  emoji: string
  room: string
  x: number
  y: number
  width: number
  height: number
}

export interface CharacterPosition {
  x: number
  y: number
}

export type DrawerMode =
  | 'theater'
  | 'diary'
  | 'messages'
  | 'about'
  | 'furniture'

export interface DrawerState {
  open: boolean
  mode: DrawerMode
  relatedObject?: string
}
