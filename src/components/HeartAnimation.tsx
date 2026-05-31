import { useState } from 'react'

interface HeartAnimationProps {
  x: number
  y: number
  visible: boolean
}

export default function HeartAnimation({ x, y, visible }: HeartAnimationProps) {
  const [hearts] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      dx: (Math.random() - 0.5) * 60,
      delay: Math.random() * 0.5,
      size: 12 + Math.random() * 8,
    }))
  )

  if (!visible) return null

  return (
    <div
      className="absolute pointer-events-none z-40"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            animation: `heart-float 1.5s ease-out ${h.delay}s forwards`,
            left: 0,
            top: 0,
            fontSize: h.size,
            opacity: 0,
          }}
        >
          <div
            className="text-red-400"
            style={{
              transform: `translate(${h.dx}px, -${20 + Math.random() * 20}px)`,
            }}
          >
            {['❤️', '💕', '💖', '💗', '✨', '💝'][h.id]}
          </div>
        </div>
      ))}
    </div>
  )
}
