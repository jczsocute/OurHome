import type { ReactNode } from 'react'
import type { DrawerMode, Message } from '../types'
import TheaterPanel from './TheaterPanel'
import DiaryPanel from './DiaryPanel'
import MessagePanel from './MessagePanel'
import AboutPanel from './AboutPanel'

interface SideDrawerProps {
  open: boolean
  mode: DrawerMode
  relatedObject?: string
  messages: Message[]
  onAddMessage: (name: string, content: string) => void
  onClose: () => void
}

export default function SideDrawer({
  open,
  mode,
  relatedObject,
  messages,
  onAddMessage,
  onClose,
}: SideDrawerProps) {
  const renderContent = (): ReactNode => {
    switch (mode) {
      case 'theater':
        return <TheaterPanel />
      case 'diary':
        return <DiaryPanel filterObject={relatedObject} />
      case 'messages':
        return <MessagePanel messages={messages} onAdd={onAddMessage} />
      case 'about':
        return <AboutPanel />
      case 'furniture':
        return <DiaryPanel filterObject={relatedObject} />
      default:
        return null
    }
  }

  return (
    <div
      className={`fixed z-40 transition-all duration-300 ease-in-out
        md:top-0 md:right-0 md:h-full md:w-[420px]
        max-md:bottom-0 max-md:left-0 max-md:w-full max-md:h-[70vh] max-md:rounded-t-3xl
        ${open ? 'translate-x-0 max-md:translate-y-0' : 'translate-x-full max-md:translate-y-full'}
      `}
    >
      <div className="relative h-full md:rounded-l-3xl max-md:rounded-t-3xl glass shadow-2xl overflow-hidden border border-white/30">
        <div className="h-full overflow-y-auto p-6 pt-14">
          {renderContent()}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <span className="text-xs text-gray-400 hidden sm:inline">
          {mode === 'furniture' ? relatedObject : ''}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/90 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all shadow cursor-pointer"
          title="关闭面板"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
