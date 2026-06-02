import type { Diary, Theater, Message } from '../types'

export const diaries: Diary[] = [
  {
    id: 'd1',
    title: '第一次一起吃砂锅粥',
    date: '2022-04-23',
    location: '宜兴',
    tags: ['美食', '第一次'],
    relatedObject: 'dining_table',
    content:
      '那天我们一起吃了砂锅粥，热气一直往上冒。你帮我吹凉，说慢慢吃。现在想起来，还是觉得很温暖。那家店后来成了我们经常去的地方。',
  },
  {
    id: 'd2',
    title: '一起逛超市的日常',
    date: '2022-05-15',
    location: '深圳',
    tags: ['日常', '宅家'],
    relatedObject: 'fridge',
    content:
      '每次去超市你都要在冰箱前站很久，纠结买什么口味的酸奶。我推着车在旁边等你，突然觉得这样的生活就是最幸福的样子。',
  },
  {
    id: 'd3',
    title: '你做的第一顿饭',
    date: '2022-06-08',
    location: '深圳',
    tags: ['美食', '第一次', '感动'],
    relatedObject: 'stove',
    content:
      '你第一次给我做饭，番茄炒蛋和一碗面。虽然简单，但我觉得那是世界上最好吃的饭。你一边炒菜一边抱怨油烟，但眼睛里有光。',
  },
  {
    id: 'd4',
    title: '深夜一起写论文',
    date: '2022-10-20',
    location: '深圳',
    tags: ['学习', '宅家'],
    relatedObject: 'desk',
    content:
      'deadline 前一天晚上，我们在书桌前并肩坐着，你写论文，我改 PPT。键盘声和翻书声交织在一起。凌晨三点的时候你趴在我肩上睡着了，我一动也不敢动。',
  },
  {
    id: 'd5',
    title: '沙发上的电影夜',
    date: '2023-02-14',
    location: '深圳',
    tags: ['宅家', '纪念日'],
    relatedObject: 'sofa',
    content:
      '情人节那天我们窝在沙发上看《怦然心动》。看到一半你问我：你觉得朱莉像不像我？我说：你比她可爱多了。你笑着把爆米花塞到我嘴里。',
  },
  {
    id: 'd6',
    title: '第一次吵架和好',
    date: '2023-05-10',
    location: '深圳',
    tags: ['成长', '感动'],
    relatedObject: 'bed',
    content:
      '因为一件小事吵了架，各自背对着躺在床上。过了十分钟，你突然转过身说：我们不要吵架了好不好。我抱住你，觉得这辈子就是你了。',
  },
  {
    id: 'd7',
    title: '一起去海边',
    date: '2023-07-28',
    location: '惠州',
    tags: ['旅行', '约会'],
    relatedObject: 'bathtub',
    content:
      '在海边玩了一整天，回来泡澡的时候你说：下次我们还去看海好不好。我说好，每年都去。你伸出手指和我拉勾，浴室里都是笑声。',
  },
  {
    id: 'd8',
    title: '你洗衣服的样子',
    date: '2024-01-15',
    location: '深圳',
    tags: ['日常', '宅家'],
    relatedObject: 'washing_machine',
    content:
      '你第一次用洗衣机，研究了半天按钮。我说我来教你，你说不要，你要自己学会。后来每次洗衣服你都特别骄傲地告诉我今天洗的是什么模式。',
  },
  {
    id: 'd9',
    title: '留言墙上的温暖',
    date: '2024-06-01',
    location: '深圳',
    tags: ['日常', '感动'],
    relatedObject: 'message_wall',
    content:
      '有一天回家，发现你在留言墙上贴了一张便利贴，上面写着：今天也很爱你。从那以后，我们的留言墙越来越满，每一张都是我们之间的秘密。',
  },
  {
    id: 'd10',
    title: '第一次一起跨年',
    date: '2024-12-31',
    location: '深圳',
    tags: ['纪念日', '第一次'],
    relatedObject: 'sofa',
    content:
      '零点的时候外面放起了烟花，我们坐在沙发上透过窗户看。你说新的一年也要一起。我说以后的每一年都要。你靠在我肩上，那一刻什么都刚刚好。',
  },
]

export const theaters: Theater[] = [
  {
    id: 't1',
    title: '冰箱前的争论',
    date: '今天',
    content:
      '她站在冰箱前，打开又关上，说想喝奶茶。\n\n他说已经很晚了。\n\n她看着他，不说话。\n\n他沉默了两秒：那我点小杯的。\n\n她笑了：我就知道你最好了。',
  },
  {
    id: 't2',
    title: '厨房里的二人转',
    date: '今天',
    content:
      '他说今天我来做饭。\n\n她怀疑地看着他：你确定？\n\n他系上围裙，胸有成竹。\n\n十分钟后——\n\n她：锅糊了锅糊了！\n\n他：我是在做焦香风味！\n\n她笑着把他推到一边：还是我来吧，大厨。',
  },
  {
    id: 't3',
    title: '沙发上的秘密',
    date: '今天',
    content:
      '两个人窝在沙发上。\n\n她突然问：你有没有对我藏过秘密？\n\n他想了想：有一个。\n\n她紧张地看着他。\n\n他凑到她耳边：其实我比你想象中更爱你。\n\n她打了下他的肩膀，嘴角却怎么也压不下去。',
  },
  {
    id: 't4',
    title: '书桌前的深夜',
    date: '今天',
    content:
      '凌晨一点，他还坐在书桌前改文档。\n\n她端着一杯热牛奶走过来，放在他手边。\n\n他抬头看她：怎么还没睡？\n\n她说：等你。\n\n他合上电脑：走吧，不写了我陪你。\n\n灯关掉的那一刻，月亮刚好照进来。',
  },
  {
    id: 't5',
    title: '洗漱间的泡泡大战',
    date: '今天',
    content:
      '她在浴室里大叫：啊啊啊你把洗发水用完了！\n\n他在客厅回：我忘了买，明天一定。\n\n她从门缝探出头：不行，现在就去便利店。\n\n他：穿着睡衣？\n\n她：穿着睡衣怎么了，又不是没穿过。\n\n于是一个穿睡衣的男人，深夜出现在便利店，手里拿着洗发水。',
  },
]

export const defaultMessages: Message[] = [
  {
    id: 'm1',
    name: '路过的朋友',
    content: '祝你们一直幸福下去！',
    createdAt: '2026-05-31',
  },
  {
    id: 'm2',
    name: '小猫咪',
    content: '喵~ 在这个家感觉很温暖呢',
    createdAt: '2026-05-30',
  },
  {
    id: 'm3',
    name: '天上的星星',
    content: '每次看到你们我都会发光',
    createdAt: '2026-05-29',
  },
]
