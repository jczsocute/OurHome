import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { theaters as mockTheaters } from '../data/mockData'
import type { Theater } from '../types'

export async function fetchTheaters(): Promise<Theater[]> {
  if (!isSupabaseConfigured()) return mockTheaters

  const { data, error } = await supabase
    .from('theaters')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.warn('Failed to fetch theaters from Supabase, falling back to mock data', error)
    return mockTheaters
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    title: row.title as string,
    date: row.date as string,
    content: ((row.content as string) || '').replace(/\\n/g, '\n'),
  }))
}
