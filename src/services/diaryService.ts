import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { diaries as mockDiaries } from '../data/mockData'
import type { Diary } from '../types'

export async function fetchDiaries(): Promise<Diary[]> {
  if (!isSupabaseConfigured()) return mockDiaries

  const { data, error } = await supabase
    .from('diaries')
    .select('*')
    .eq('visibility', 'public')
    .order('date', { ascending: false })

  if (error) {
    console.warn('Failed to fetch diaries from Supabase, falling back to mock data', error)
    return mockDiaries
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    title: row.title as string,
    date: row.date as string,
    location: row.location as string,
    tags: row.tags as string[],
    relatedObject: row.related_object as string,
    content: row.content as string,
  }))
}
