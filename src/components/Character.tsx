import type { CharacterPosition } from '../types'
import SpeechBubble from './SpeechBubble'

interface CharacterProps {
  position: CharacterPosition
  isBoy: boolean
  isWalking: boolean
  showBubble: boolean
  bubbleText: string
  isFurnitureInteraction?: boolean
  isSelected?: boolean
  onClick?: () => void
}

export default function Character({
  position,
  isBoy,
  isWalking,
  showBubble,
  bubbleText,
  isFurnitureInteraction,
  isSelected,
  onClick,
}: CharacterProps) {
  const charColor = isBoy ? 'bg-blue-500' : 'bg-pink-400'
  const shadowColor = isBoy ? 'bg-blue-400/60' : 'bg-pink-300/60'
  const glowColor = isBoy
    ? 'rgba(59, 130, 246, 0.5)'
    : 'rgba(244, 114, 182, 0.5)'

  return (
    <>
      <div
        className={`absolute z-20 ${isSelected ? 'z-30' : ''}`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          onClick={onClick}
          className={`relative cursor-pointer transition-transform duration-200 ${
            isSelected ? 'scale-125' : 'hover:scale-110'
          } ${isWalking ? 'animate-float' : ''}`}
          title={isSelected ? '点击取消选中' : '点击选中人物'}
        >
          {isSelected && (
            <div
              className="absolute animate-pulse pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                width: '16px',
                height: '16px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '3px',
                boxShadow: `inset 0 0 6px 2px ${glowColor}, 0 0 8px 4px ${glowColor}`,
              }}
            />
          )}
          <div
            className={`w-5 h-5 pixel-crisp rounded-sm shadow-md relative ${charColor}`}
          >
            <div className="w-full h-full flex items-center justify-center text-xs">
              {isBoy ? '👦' : '👧'}
            </div>
          </div>
          <div className={`w-3 h-3 mx-auto -mt-1 rounded-sm ${shadowColor}`} />
        </div>
      </div>

      {showBubble && (
        <SpeechBubble
          text={bubbleText}
          x={position.x}
          y={position.y}
          isBoy={isBoy}
          isFurniture={isFurnitureInteraction}
        />
      )}
    </>
  )
}
