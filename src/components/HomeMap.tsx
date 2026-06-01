import { useRef, useCallback, useEffect, useState } from 'react'
import { FURNITURE_DATA, INTERACTIVE_FURNITURE } from '../data/furniture'
import { ROOMS, ROOM_BG } from '../data/rooms'
import { COUPLE_INTERACTION_PHRASES } from '../data/interactions'
import { getRandomItem, useRandomWalk } from '../hooks/useRandomWalk'
import type { WalkCallbacks } from '../hooks/useRandomWalk'

import Furniture from './Furniture'
import Character from './Character'
import HeartAnimation from './HeartAnimation'
import type { FurnitureItem, CharacterPosition } from '../types'

interface HomeMapProps {
  onFurnitureClick: (id: string) => void
}

const BOY_START = { x: 30, y: 63 }
const GIRL_START = { x: 50, y: 52 }
const COUPLE_CHANCE = 0.3

function getFurnitureCenter(f: FurnitureItem): CharacterPosition {
  return { x: f.x + f.width / 2, y: f.y + f.height / 2 }
}

function getDualTargets(f: FurnitureItem): { boy: CharacterPosition; girl: CharacterPosition } {
  const cx = f.x + f.width / 2
  const cy = f.y + f.height / 2
  const offset = Math.min(f.width, f.height) * 0.2
  return {
    boy: { x: cx - offset, y: cy },
    girl: { x: cx + offset, y: cy },
  }
}

export default function HomeMap({ onFurnitureClick }: HomeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const boyRef = useRef<ReturnType<typeof useRandomWalk> | null>(null)
  const girlRef = useRef<ReturnType<typeof useRandomWalk> | null>(null)

  const [selectedBoy, setSelectedBoy] = useState(false)
  const [selectedGirl, setSelectedGirl] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        e.preventDefault()
        setDebugMode((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const tryCoupleInteraction = useCallback(
    (furniture: FurnitureItem, initiatorIsBoy: boolean): boolean => {
      const initiator = initiatorIsBoy ? boyRef.current : girlRef.current
      const other = initiatorIsBoy ? girlRef.current : boyRef.current
      if (!initiator || !other) return false
      if (other.isBusy()) return false
      if (Math.random() >= COUPLE_CHANCE) return false

      const phrases = COUPLE_INTERACTION_PHRASES[furniture.id]
      if (!phrases || phrases.length === 0) return false

      const phrase = getRandomItem(phrases)
      const dual = getDualTargets(furniture)
      const initiatorTarget = initiatorIsBoy ? dual.boy : dual.girl
      const otherTarget = initiatorIsBoy ? dual.girl : dual.boy
      const initiatorPhrase = initiatorIsBoy ? phrase.boy : phrase.girl
      const otherPhrase = initiatorIsBoy ? phrase.girl : phrase.boy

      initiator.doCoupleInteraction(initiatorTarget, initiatorPhrase)
      other.doCoupleInteraction(otherTarget, otherPhrase)
      return true
    },
    []
  )

  const onBoyAutoInteract = useCallback(
    (furniture: FurnitureItem): boolean => tryCoupleInteraction(furniture, true),
    [tryCoupleInteraction]
  )

  const onGirlAutoInteract = useCallback(
    (furniture: FurnitureItem): boolean => tryCoupleInteraction(furniture, false),
    [tryCoupleInteraction]
  )

  const boyCallbacks: WalkCallbacks = { onAutoFurnitureInteract: onBoyAutoInteract }
  const girlCallbacks: WalkCallbacks = { onAutoFurnitureInteract: onGirlAutoInteract }

  const boyWalk = useRandomWalk(FURNITURE_DATA, BOY_START, true, boyCallbacks)
  const girlWalk = useRandomWalk(FURNITURE_DATA, GIRL_START, false, girlCallbacks)

  boyRef.current = boyWalk
  girlRef.current = girlWalk

  useEffect(() => {
    boyWalk.setOtherPosition(girlWalk.position)
  }, [boyWalk.setOtherPosition, girlWalk.position])

  useEffect(() => {
    girlWalk.setOtherPosition(boyWalk.position)
  }, [girlWalk.setOtherPosition, boyWalk.position])

  const boyPos = boyWalk.position
  const girlPos = girlWalk.position

  const distance = Math.sqrt(
    (boyPos.x - girlPos.x) ** 2 + (boyPos.y - girlPos.y) ** 2
  )
  const isClose = distance < 15
  const showHeart = isClose && (boyWalk.showBubble || girlWalk.showBubble)

  const handleCharacterClick = useCallback(
    (isBoy: boolean) => {
      if (isBoy) {
        setSelectedBoy((prev) => !prev)
      } else {
        setSelectedGirl((prev) => !prev)
      }
    },
    []
  )

  const moveToFurniture = useCallback(
    (f: FurnitureItem) => {
      const center = getFurnitureCenter(f)
      const dual = getDualTargets(f)
      const hasSelection = selectedBoy || selectedGirl

      if (!hasSelection) return false

      if (selectedBoy && selectedGirl) {
        const phrases = COUPLE_INTERACTION_PHRASES[f.id]
        if (phrases && phrases.length > 0) {
          const phrase = getRandomItem(phrases)
          boyWalk.doCoupleInteraction(dual.boy, phrase.boy)
          girlWalk.doCoupleInteraction(dual.girl, phrase.girl)
        } else {
          boyWalk.moveToTarget(dual.boy, f, (furniture) => {
            boyWalk.doFurnitureInteraction(furniture)
          })
          girlWalk.moveToTarget(dual.girl, f, (furniture) => {
            girlWalk.doFurnitureInteraction(furniture)
          })
        }
      } else if (selectedBoy) {
        if (tryCoupleInteraction(f, true)) {
          // couple mode handled it
        } else {
          boyWalk.moveToTarget(center, f, (furniture) => {
            boyWalk.doFurnitureInteraction(furniture)
          })
        }
      } else if (selectedGirl) {
        if (tryCoupleInteraction(f, false)) {
          // couple mode handled it
        } else {
          girlWalk.moveToTarget(center, f, (furniture) => {
            girlWalk.doFurnitureInteraction(furniture)
          })
        }
      }

      setSelectedBoy(false)
      setSelectedGirl(false)
      return true
    },
    [selectedBoy, selectedGirl, boyWalk, girlWalk, tryCoupleInteraction]
  )

  const handleFurnitureClick = useCallback(
    (id: string) => {
      if (!INTERACTIVE_FURNITURE.has(id)) return

      const furniture = FURNITURE_DATA.find((f) => f.id === id)
      if (!furniture) return

      const hasSelection = selectedBoy || selectedGirl

      if (hasSelection && moveToFurniture(furniture)) {
        return
      }

      onFurnitureClick(id)
    },
    [selectedBoy, selectedGirl, moveToFurniture, onFurnitureClick]
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFF5F0 0%, #FFF0E6 30%, #FFF8F5 60%, #F5F0FF 100%)',
      }}
    >
      {ROOMS.map((room) => (
        <div
          key={room.id}
          className="absolute rounded-2xl border border-dashed transition-colors"
          style={{
            left: `${room.x}%`,
            top: `${room.y}%`,
            width: `${room.w}%`,
            height: `${room.h}%`,
            backgroundColor: ROOM_BG[room.id] || '#FFF8F0',
            borderColor: 'rgba(180,160,140,0.15)',
          }}
        >
          <span
            className="absolute text-[9px] font-medium select-none"
            style={{
              left: '8px',
              top: '6px',
              color: 'rgba(150,130,110,0.5)',
              letterSpacing: '0.5px',
            }}
          >
            {room.label}
          </span>
        </div>
      ))}

      {FURNITURE_DATA.map((item) => (
        <Furniture
          key={item.id}
          item={item}
          onClick={handleFurnitureClick}
          interactive={INTERACTIVE_FURNITURE.has(item.id)}
        />
      ))}

      <Character
        position={boyWalk.position}
        isBoy={true}
        isWalking={boyWalk.isWalking}
        showBubble={boyWalk.showBubble}
        bubbleText={boyWalk.bubbleText}
        isFurnitureInteraction={boyWalk.isFurnitureInteraction}
        isSelected={selectedBoy}
        onClick={() => handleCharacterClick(true)}
      />
      <Character
        position={girlWalk.position}
        isBoy={false}
        isWalking={girlWalk.isWalking}
        showBubble={girlWalk.showBubble}
        bubbleText={girlWalk.bubbleText}
        isFurnitureInteraction={girlWalk.isFurnitureInteraction}
        isSelected={selectedGirl}
        onClick={() => handleCharacterClick(false)}
      />

      {debugMode && (
        <>
          <div
            className="absolute z-40 pointer-events-none select-none"
            style={{
              left: `${boyWalk.position.x}%`,
              top: `${boyWalk.position.y}%`,
              transform: 'translate(-50%, -50%) translateY(-18px)',
            }}
          >
            <span className="text-[10px] font-mono bg-black/70 text-green-400 px-1.5 py-0.5 rounded">
              定时器:{boyWalk.activeTimerCount}
            </span>
          </div>
          <div
            className="absolute z-40 pointer-events-none select-none"
            style={{
              left: `${girlWalk.position.x}%`,
              top: `${girlWalk.position.y}%`,
              transform: 'translate(-50%, -50%) translateY(-18px)',
            }}
          >
            <span className="text-[10px] font-mono bg-black/70 text-pink-300 px-1.5 py-0.5 rounded">
              定时器:{girlWalk.activeTimerCount}
            </span>
          </div>
        </>
      )}

      {showHeart && (
        <HeartAnimation
          x={(boyPos.x + girlPos.x) / 2}
          y={Math.min(boyPos.y, girlPos.y)}
          visible={true}
        />
      )}

      <div className="absolute bottom-4 left-4 text-[10px] text-gray-400 select-none">
        {selectedBoy || selectedGirl
          ? '✨ 已选中人物 · 点击家具让 Ta 走过去'
          : '✨ 点击家具查看回忆 · 点击小人可以选中'}
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] text-gray-400 select-none">
        {debugMode ? (
          <button
            onClick={() => setDebugMode(false)}
            className="bg-black/60 text-green-400 px-2 py-1 rounded font-mono hover:bg-black/80 cursor-pointer"
          >
            调试:ON · 点击关闭
          </button>
        ) : (
          <span className="opacity-40">Ctrl+D 调试模式</span>
        )}
      </div>
    </div>
  )
}
