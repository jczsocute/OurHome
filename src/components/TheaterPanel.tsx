import { useState, useEffect } from 'react'
import { fetchTheaters } from '../services/theaterService'
import { getRandomItem } from '../hooks/useRandomWalk'
import type { Theater } from '../types'

export default function TheaterPanel() {
  const [theaters, setTheaters] = useState<Theater[]>([])
  const [currentTheater, setCurrentTheater] = useState<Theater | null>(null)

  useEffect(() => {
    fetchTheaters().then((data) => {
      setTheaters(data)
      if (data.length > 0) setCurrentTheater(data[0])
    })
  }, [])

  const shuffle = () => {
    if (theaters.length <= 1) return
    let next: Theater
    do {
      next = getRandomItem(theaters)
    } while (next.id === currentTheater?.id)
    setCurrentTheater(next)
  }

  if (!currentTheater) {
    return (
      <div className="animate-fade-in-up p-1">
        <h2 className="text-xl font-bold text-purple-700 mb-4">🎭 小剧场</h2>
        <p className="text-sm text-gray-400 text-center py-8">加载中...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up p-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-700">🎭 小剧场</h2>
        <button
          onClick={shuffle}
          className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
        >
          🔄 换一个小剧场
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-3 italic">
        * 小剧场是根据真实回忆生成的虚构番外
      </p>

      <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-100">
        <h3 className="text-lg font-bold text-purple-800 mb-1">
          {currentTheater.title}
        </h3>
        <p className="text-xs text-purple-400 mb-4">{currentTheater.date}</p>
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {currentTheater.content}
        </div>
      </div>
    </div>
  )
}
