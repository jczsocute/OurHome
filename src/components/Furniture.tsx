import type { FurnitureItem } from '../types'

interface FurnitureProps {
  item: FurnitureItem
  onClick?: (id: string) => void
  interactive?: boolean
}

const ROOM_COLORS: Record<string, string> = {
  living: 'bg-amber-100/40 border-amber-200/50',
  kitchen: 'bg-orange-100/30 border-orange-200/50',
  bedroom: 'bg-rose-100/30 border-rose-200/50',
  study: 'bg-blue-100/30 border-blue-200/50',
  bathroom: 'bg-cyan-100/30 border-cyan-200/50',
  hallway: 'bg-yellow-100/30 border-yellow-200/50',
}

export default function Furniture({ item, onClick, interactive }: FurnitureProps) {
  return (
    <div
      className={`absolute border rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer select-none ${
        interactive
          ? 'hover:scale-110 hover:shadow-lg hover:z-10 hover:animate-pulse-glow'
          : ''
      } ${ROOM_COLORS[item.room] || ''}`}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.width}%`,
        height: `${item.height}%`,
        minWidth: '22px',
        minHeight: '22px',
      }}
      onClick={() => interactive && onClick?.(item.id)}
      title={interactive ? item.name : undefined}
    >
      <span className="text-base leading-none">{item.emoji}</span>
      <span className="text-[8px] text-gray-400 mt-0.5 leading-tight hidden sm:block">
        {item.name}
      </span>
    </div>
  )
}
