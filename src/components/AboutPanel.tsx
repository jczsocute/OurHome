export default function AboutPanel() {
  return (
    <div className="animate-fade-in-up p-1">
      <h2 className="text-xl font-bold text-rose-700 mb-4">
        💕 关于我们
      </h2>
      <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
        <p>
          这里是我们的小家。
        </p>
        <p>
          我们把一些真实的恋爱日记、生活瞬间和朋友们的祝福放在这里。
          两个小人会在家里走来走去，像我们普通又珍贵的日常。
        </p>
        <p>
          家里的沙发、餐桌、冰箱、书桌……每一个角落都藏着一个故事。
          你可以点点看。
        </p>
        <p>
          留言墙上贴着朋友们的祝福，你也可以留下你的。
        </p>
        <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-100">
          <p className="text-rose-600 text-xs">
            🌸 我们在一起的第 {Math.floor((Date.now() - new Date('2022-03-24').getTime()) / (1000 * 60 * 60 * 24))} 天。
            每一天都很珍贵。
          </p>
        </div>
      </div>
    </div>
  )
}
