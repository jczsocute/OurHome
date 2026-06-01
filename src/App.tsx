import { useState, useCallback, useEffect } from 'react'
import HomeMap from './components/HomeMap'
import TopNav from './components/TopNav'
import SideDrawer from './components/SideDrawer'
import type { DrawerMode, DrawerState, Message } from './types'
import { fetchMessages, addMessage as addMessageService } from './services/messageService'

const INITIAL_DRAWER: DrawerState = {
  open: false,
  mode: 'theater',
  relatedObject: undefined,
}

export default function App() {
  const [drawer, setDrawer] = useState<DrawerState>(INITIAL_DRAWER)
  const [messages, setMessages] = useState<Message[]>([])
  const [appHeight, setAppHeight] = useState<number>(0)

  useEffect(() => {
    fetchMessages().then(setMessages)
  }, [])

  useEffect(() => {
    const update = () => setAppHeight(window.innerHeight)
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  const addMessage = useCallback(async (name: string, content: string) => {
    const newMsg = await addMessageService(name, content)
    setMessages((prev) => [newMsg, ...prev])
  }, [])

  const openDrawer = useCallback(
    (mode: DrawerMode, relatedObject?: string) => {
      if (drawer.open && drawer.mode === mode && drawer.relatedObject === relatedObject) {
        setDrawer(INITIAL_DRAWER)
      } else {
        setDrawer({ open: true, mode, relatedObject })
      }
    },
    [drawer]
  )

  const closeDrawer = useCallback(() => {
    setDrawer(INITIAL_DRAWER)
  }, [])

  const handleNavClick = useCallback(
    (mode: DrawerMode) => {
      openDrawer(mode)
    },
    [openDrawer]
  )

  const handleFurnitureClick = useCallback(
    (id: string) => {
      openDrawer('furniture', id)
    },
    [openDrawer]
  )

  return (
    <div
      className="relative w-screen overflow-hidden"
      style={{
        height: appHeight ? `${appHeight}px` : '100dvh',
        background: 'linear-gradient(135deg, #FFEDE0 0%, #FDE8D8 30%, #FFF0EB 60%, #EDE0F8 100%)',
      }}
    >
      <TopNav
        onNavigate={handleNavClick}
        activeMode={drawer.open ? drawer.mode : null}
      />

      <div className="w-full h-full pt-12 pb-1 px-1 sm:pt-14 sm:pb-2 sm:px-2">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20">
          <HomeMap
            onFurnitureClick={handleFurnitureClick}
          />
        </div>
      </div>

      <SideDrawer
        open={drawer.open}
        mode={drawer.mode}
        relatedObject={drawer.relatedObject}
        messages={messages}
        onAddMessage={addMessage}
        onClose={closeDrawer}
      />
    </div>
  )
}
