import { useState } from 'react'
import type { Message } from '../types'

interface MessagePanelProps {
  messages: Message[]
  onAdd: (name: string, content: string) => void
}

export default function MessagePanel({ messages, onAdd }: MessagePanelProps) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!content.trim()) return
    onAdd(name, content)
    setName('')
    setContent('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <div className="animate-fade-in-up p-1">
      <h2 className="text-xl font-bold text-teal-700 mb-4">💌 留言板</h2>

      <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100 mb-4">
        <input
          type="text"
          placeholder="你的昵称（选填）"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          className="w-full px-3 py-2 rounded-xl bg-white/80 border border-teal-100 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-300 mb-2"
        />
        <textarea
          placeholder="写下你的祝福..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={200}
          rows={3}
          className="w-full px-3 py-2 rounded-xl bg-white/80 border border-teal-100 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-300 resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {content.length}/200
          </span>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-4 py-1.5 bg-teal-500 text-white text-sm rounded-full hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {submitted ? '✅ 已发送' : '发送祝福'}
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            还没有留言，来做第一个留言的人吧~
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white/70 rounded-xl p-3.5 border border-teal-50 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-700 text-sm">
                {msg.name}
              </span>
              <span className="text-xs text-gray-400">{msg.createdAt}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {msg.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
