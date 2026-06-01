import { createClient } from '@supabase/supabase-js'

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const MAX_REQUESTS = 5
const WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now >= entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return false
  }

  if (entry.count >= MAX_REQUESTS) {
    return true
  }

  entry.count++
  return false
}

function sanitize(input: string, maxLen: number): string {
  return input.replace(/<[^>]*>/g, '').slice(0, maxLen).trim()
}

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: '操作太频繁，请稍后再试' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body: { name?: string; content?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: '无效的请求数据' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const content = sanitize(body.content || '', 500)
  if (!content) {
    return new Response(JSON.stringify({ error: '留言内容不能为空' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const name = sanitize(body.name || '匿名', 20)

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: '服务器配置错误' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data, error } = await supabase
    .from('messages')
    .insert({ name: name || '匿名', content })
    .select('id, name, content, created_at')
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: '提交失败，请稍后重试' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(
    JSON.stringify({
      id: data.id,
      name: data.name,
      content: data.content,
      createdAt: (data.created_at as string)?.slice(0, 10) || '',
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}
