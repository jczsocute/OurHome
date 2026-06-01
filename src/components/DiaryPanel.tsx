import { useState, useMemo, useEffect } from 'react'
import { fetchDiaries } from '../services/diaryService'
import type { Diary } from '../types'

interface DiaryPanelProps {
  filterObject?: string
}

const FURNITURE_NAMES: Record<string, string> = {
  sofa: '沙发',
  dining_table: '餐桌',
  fridge: '冰箱',
  stove: '灶台',
  bed: '双人床',
  desk: '书桌',
  chair: '椅子',
  washing_machine: '洗衣机',
  bathtub: '浴缸',
  toilet: '马桶',
  message_wall: '留言墙',
  coffee_table: '茶几',
  tv: '电视',
  wardrobe: '衣柜',
  computer: '电脑',
  shoe_cabinet: '鞋柜',
  plant: '绿植',
}

export default function DiaryPanel({ filterObject }: DiaryPanelProps) {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchDiaries().then(setDiaries)
  }, [])

  const allTags = useMemo(
    () => Array.from(new Set(diaries.flatMap((d) => d.tags))),
    [diaries]
  )

  const filtered = useMemo(() => {
    let result = diaries
    if (filterObject) {
      result = result.filter((d) => d.relatedObject === filterObject)
    }
    if (selectedTag) {
      result = result.filter((d) => d.tags.includes(selectedTag))
    }
    return result
  }, [diaries, filterObject, selectedTag])

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="animate-fade-in-up p-1">
      <h2 className="text-xl font-bold text-amber-700 mb-2">
        📖 恋爱日记
        {filterObject && FURNITURE_NAMES[filterObject] && (
          <span className="text-sm font-normal text-amber-500 ml-2">
            · {FURNITURE_NAMES[filterObject]}相关
          </span>
        )}
      </h2>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-2.5 py-0.5 rounded-full text-xs transition-colors cursor-pointer ${
            !selectedTag
              ? 'bg-amber-500 text-white'
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          全部
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-2.5 py-0.5 rounded-full text-xs transition-colors cursor-pointer ${
              selectedTag === tag
                ? 'bg-amber-500 text-white'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            暂无相关日记
          </p>
        )}
        {filtered.map((diary) => (
          <DiaryCard
            key={diary.id}
            diary={diary}
            expanded={expandedId === diary.id}
            onToggle={() => toggleExpand(diary.id)}
          />
        ))}
      </div>
    </div>
  )
}

function DiaryCard({
  diary,
  expanded,
  onToggle,
}: {
  diary: Diary
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="bg-amber-50/50 rounded-xl border border-amber-100 p-3.5 hover:border-amber-200 transition-colors cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm">{diary.title}</h4>
          <p className="text-xs text-gray-400 mt-0.5">
            {diary.date} · {diary.location}
          </p>
        </div>
        <span className="text-xs text-amber-400 shrink-0 ml-2 mt-0.5">
          {expanded ? '收起 ▲' : '展开 ▼'}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {diary.tags.map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      {expanded && (
        <p className="text-sm text-gray-600 mt-3 leading-relaxed animate-fade-in-up">
          {diary.content}
        </p>
      )}
    </div>
  )
}
