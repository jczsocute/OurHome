import type { DrawerMode } from '../types'

interface TopNavProps {
  onNavigate: (mode: DrawerMode) => void
  activeMode: DrawerMode | null
}

const NAV_ITEMS: { mode: DrawerMode; label: string; icon: string }[] = [
  { mode: 'theater', label: '小剧场', icon: '🎭' },
  { mode: 'diary', label: '恋爱日记', icon: '📖' },
  { mode: 'messages', label: '留言', icon: '💌' },
  { mode: 'about', label: '关于我们', icon: '💕' },
]

export default function TopNav({ onNavigate, activeMode }: TopNavProps) {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center px-4 py-3 gap-2.5">
      <span className="text-lg mr-1">🏠</span>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.mode}
          onClick={() => onNavigate(item.mode)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer
            backdrop-blur-sm
            ${activeMode === item.mode
              ? 'bg-white/70 text-rose-700 shadow-md'
              : 'bg-white/30 text-stone-600 hover:text-rose-600 hover:bg-white/50 hover:shadow-sm'
            }`}
        >
          <span className="inline mr-0.5">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
