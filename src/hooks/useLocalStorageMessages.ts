import { useState, useEffect } from 'react'
import type { Message } from '../types'
import { defaultMessages } from '../data/mockData'

const STORAGE_KEY = 'ourhome_messages'

export function useLocalStorageMessages() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Message[]
        if (parsed.length > 0) return parsed
      }
    } catch {
      // ignore
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMessages))
    return defaultMessages
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const addMessage = (name: string, content: string) => {
    const newMsg: Message = {
      id: `m${Date.now()}`,
      name: name.trim() || '匿名',
      content: content.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setMessages((prev) => [newMsg, ...prev])
  }

  return { messages, addMessage }
}
