import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { defaultMessages as mockMessages } from '../data/mockData'
import type { Message } from '../types'

const STORAGE_KEY = 'ourhome_messages'

function loadLocalFallback(): Message[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Message[]
      if (parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return mockMessages
}

function saveLocalFallback(messages: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export async function fetchMessages(): Promise<Message[]> {
  if (!isSupabaseConfigured()) return loadLocalFallback()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Failed to fetch messages from Supabase, falling back to localStorage', error)
    return loadLocalFallback()
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: row.name as string,
    content: row.content as string,
    createdAt: (row.created_at as string)?.slice(0, 10) || '',
  }))
}

export async function addMessage(name: string, content: string): Promise<Message> {
  if (!isSupabaseConfigured()) {
    const msgs = loadLocalFallback()
    const newMsg: Message = {
      id: `m${Date.now()}`,
      name: name.trim() || '匿名',
      content: content.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    msgs.unshift(newMsg)
    saveLocalFallback(msgs)
    return newMsg
  }

  try {
    const res = await fetch('/api/submit-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), content: content.trim() }),
    })

    if (res.ok) {
      return await res.json()
    }

    const errData = await res.json().catch(() => ({}))
    if (res.status === 429) {
      throw new Error(errData.error || '操作太频繁，请稍后再试')
    }
    throw new Error(errData.error || '提交失败')
  } catch (err) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      console.warn('Netlify Function unavailable, falling back to direct Supabase insert')
    } else if (err instanceof Error && err.message.includes('提交')) {
      throw err
    } else {
      console.warn('Netlify Function unavailable, falling back to direct Supabase insert')
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({ name: name.trim() || '匿名', content: content.trim() })
      .select()
      .single()

    if (error) {
      console.warn('Failed to add message to Supabase, using localStorage fallback', error)
      const msgs = loadLocalFallback()
      const newMsg: Message = {
        id: `m${Date.now()}`,
        name: name.trim() || '匿名',
        content: content.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      }
      msgs.unshift(newMsg)
      saveLocalFallback(msgs)
      return newMsg
    }

    return {
      id: data.id as string,
      name: data.name as string,
      content: data.content as string,
      createdAt: (data.created_at as string)?.slice(0, 10) || '',
    }
  }
}
