interface SpeechBubbleProps {
  text: string
  x: number
  y: number
  isBoy: boolean
  isFurniture?: boolean
}

export default function SpeechBubble({ text, x, y, isBoy, isFurniture }: SpeechBubbleProps) {
  const colorClass = isFurniture
    ? 'bg-amber-100/60 text-amber-800 border border-amber-200/40'
    : isBoy
      ? 'bg-blue-100/60 text-blue-800 border border-blue-200/40'
      : 'bg-pink-100/60 text-pink-800 border border-pink-200/40'

  const tailClass = isFurniture
    ? 'bg-amber-100/60 border-b border-r border-amber-200/40'
    : isBoy
      ? 'bg-blue-100/60 border-b border-r border-blue-200/40'
      : 'bg-pink-100/60 border-b border-r border-pink-200/40'

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        left: `${x}%`,
        top: `${y - 3}%`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="animate-bounce-in">
        <div className={`px-3 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap shadow-lg max-w-44 text-center leading-relaxed ${colorClass}`}>
          {text}
        </div>
        <div className={`w-2.5 h-2.5 rotate-45 mx-auto -mt-1 ${tailClass}`} />
      </div>
    </div>
  )
}
