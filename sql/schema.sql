-- =============================================
-- 我们的小家 - Supabase 数据库建表脚本
-- 请在 Supabase Dashboard → SQL Editor 中运行此脚本
-- =============================================

-- 1. 恋爱日记表
CREATE TABLE IF NOT EXISTS diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  related_object TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'personal')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 留言板表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '匿名',
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 小剧场表
CREATE TABLE IF NOT EXISTS theaters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- RLS 策略（Row Level Security）
-- =============================================

-- 开启 RLS
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE theaters ENABLE ROW LEVEL SECURITY;

-- 日记：公开日记所有人可读，私人日记仅认证用户可读
CREATE POLICY "Public diaries are viewable by everyone" ON diaries
  FOR SELECT USING (visibility = 'public');

-- 留言：仅已审核的留言可读，任何人可插入（待审核）
CREATE POLICY "Approved messages are viewable by everyone" ON messages
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- 小剧场：所有人可读
CREATE POLICY "Theaters are viewable by everyone" ON theaters
  FOR SELECT USING (true);

-- =============================================
-- 导入初始数据
-- =============================================

INSERT INTO diaries (title, date, location, tags, related_object, content, visibility) VALUES
('第一次一起吃砂锅粥', '2022-01-23', '宜兴', ARRAY['见面', '吃饭', '幸福'], 'dining_table', '那天我们一起吃了砂锅粥，热气一直往上冒。你帮我吹凉，说慢慢吃。现在想起来，还是觉得很温暖。那家店后来成了我们经常去的地方。', 'public'),
('一起逛超市的日常', '2022-03-15', '深圳', ARRAY['日常', '购物', '温馨'], 'fridge', '每次去超市你都要在冰箱前站很久，纠结买什么口味的酸奶。我推着车在旁边等你，突然觉得这样的生活就是最幸福的样子。', 'public'),
('你做的第一顿饭', '2022-06-08', '深圳', ARRAY['做饭', '感动', '纪念'], 'stove', '你第一次给我做饭，番茄炒蛋和一碗面。虽然简单，但我觉得那是世界上最好吃的饭。你一边炒菜一边抱怨油烟，但眼睛里有光。', 'public'),
('深夜一起写论文', '2022-10-20', '深圳', ARRAY['学习', '陪伴', '深夜'], 'desk', 'deadline 前一天晚上，我们在书桌前并肩坐着，你写论文，我改 PPT。键盘声和翻书声交织在一起。凌晨三点的时候你趴在我肩上睡着了，我一动也不敢动。', 'public'),
('沙发上的电影夜', '2023-02-14', '深圳', ARRAY['电影', '情人节', '浪漫'], 'sofa', '情人节那天我们窝在沙发上看《怦然心动》。看到一半你问我：你觉得朱莉像不像我？我说：你比她可爱多了。你笑着把爆米花塞到我嘴里。', 'public'),
('第一次吵架和好', '2023-05-10', '深圳', ARRAY['吵架', '成长', '包容'], 'bed', '因为一件小事吵了架，各自背对着躺在床上。过了十分钟，你突然转过身说：我们不要吵架了好不好。我抱住你，觉得这辈子就是你了。', 'public'),
('一起去海边', '2023-07-28', '惠州', ARRAY['旅行', '海边', '浪漫'], 'bathtub', '在海边玩了一整天，回来泡澡的时候你说：下次我们还去看海好不好。我说好，每年都去。你伸出手指和我拉勾，浴室里都是笑声。', 'public'),
('你洗衣服的样子', '2024-01-15', '深圳', ARRAY['日常', '家务', '可爱'], 'washing_machine', '你第一次用洗衣机，研究了半天按钮。我说我来教你，你说不要，你要自己学会。后来每次洗衣服你都特别骄傲地告诉我今天洗的是什么模式。', 'public'),
('留言墙上的温暖', '2024-06-01', '深圳', ARRAY['日常', '浪漫', '惊喜'], 'message_wall', '有一天回家，发现你在留言墙上贴了一张便利贴，上面写着：今天也很爱你。从那以后，我们的留言墙越来越满，每一张都是我们之间的秘密。', 'public'),
('第一次一起跨年', '2024-12-31', '深圳', ARRAY['跨年', '纪念', '幸福'], 'sofa', '零点的时候外面放起了烟花，我们坐在沙发上透过窗户看。你说新的一年也要一起。我说以后的每一年都要。你靠在我肩上，那一刻什么都刚刚好。', 'public');

INSERT INTO messages (name, content, status) VALUES
('路过的朋友', '祝你们一直幸福下去！', 'approved'),
('小猫咪', '喵~ 在这个家感觉很温暖呢', 'approved'),
('天上的星星', '每次看到你们我都会发光', 'approved');

INSERT INTO theaters (title, date, content) VALUES
('冰箱前的争论', CURRENT_DATE, '她站在冰箱前，打开又关上，说想喝奶茶。\n\n他说已经很晚了。\n\n她看着他，不说话。\n\n他沉默了两秒：那我点小杯的。\n\n她笑了：我就知道你最好了。'),
('厨房里的二人转', CURRENT_DATE, '他说今天我来做饭。\n\n她怀疑地看着他：你确定？\n\n他系上围裙，胸有成竹。\n\n十分钟后——\n\n她：锅糊了锅糊了！\n\n他：我是在做焦香风味！\n\n她笑着把他推到一边：还是我来吧，大厨。'),
('沙发上的秘密', CURRENT_DATE, '两个人窝在沙发上。\n\n她突然问：你有没有对我藏过秘密？\n\n他想了想：有一个。\n\n她紧张地看着他。\n\n他凑到她耳边：其实我比你想象中更爱你。\n\n她打了下他的肩膀，嘴角却怎么也压不下去。'),
('书桌前的深夜', CURRENT_DATE, '凌晨一点，他还坐在书桌前改文档。\n\n她端着一杯热牛奶走过来，放在他手边。\n\n他抬头看她：怎么还没睡？\n\n她说：等你。\n\n他合上电脑：走吧，不写了我陪你。\n\n灯关掉的那一刻，月亮刚好照进来。'),
('洗漱间的泡泡大战', CURRENT_DATE, '她在浴室里大叫：啊啊啊你把洗发水用完了！\n\n他在客厅回：我忘了买，明天一定。\n\n她从门缝探出头：不行，现在就去便利店。\n\n他：穿着睡衣？\n\n她：穿着睡衣怎么了，又不是没穿过。\n\n于是一个穿睡衣的男人，深夜出现在便利店，手里拿着洗发水。');
