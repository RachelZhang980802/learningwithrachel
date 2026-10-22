export type RootWord = { word: string; part: string; meaning: string; phrase: string };
export type RootFamily = { title: string; meaning: string; note: string; sources: { label: string; url: string }[]; words: RootWord[] };

// Supplemental examples, separate from the verbatim teacher reference answers.
export const article01RootFamilies: Record<string, RootFamily> = {
  "stinct": {
    "title": "stinct / stingu",
    "meaning": "刺激、驱动；相关形式中也有“区分、作标记”的意义。",
    "note": "instinct 的常用派生词较少。先记 instinctive / instinctively，再把 distinct / distinguish 这一词族一起对照学习；不要把每个词机械译为“粘住”。不同词族之间的早期词源联系仍有不同分析。",
    "sources": [
      {
        "label": "instinct",
        "url": "https://www.etymonline.com/word/instinct"
      },
      {
        "label": "distinct / distinguish",
        "url": "https://www.etymonline.com/word/distinct"
      }
    ],
    "words": [
      {
        "word": "instinctive",
        "part": "adj.",
        "meaning": "本能的；直觉的",
        "phrase": "an instinctive reaction"
      },
      {
        "word": "instinctively",
        "part": "adv.",
        "meaning": "本能地；凭直觉地",
        "phrase": "react instinctively"
      },
      {
        "word": "distinct",
        "part": "adj.",
        "meaning": "明显不同的；清楚的",
        "phrase": "two distinct ideas"
      },
      {
        "word": "distinctly",
        "part": "adv.",
        "meaning": "清楚地；明显地",
        "phrase": "remember distinctly"
      },
      {
        "word": "distinction",
        "part": "n.",
        "meaning": "区别；差别",
        "phrase": "make a distinction"
      },
      {
        "word": "distinctive",
        "part": "adj.",
        "meaning": "有特色的；独特的",
        "phrase": "a distinctive voice"
      },
      {
        "word": "distinguish",
        "part": "v.",
        "meaning": "区分；辨别",
        "phrase": "distinguish fact from opinion"
      },
      {
        "word": "distinguished",
        "part": "adj.",
        "meaning": "杰出的；卓越的",
        "phrase": "a distinguished scientist"
      }
    ]
  },
  "scrib": {
    "title": "scrib / script",
    "meaning": "write · 写",
    "note": "scrib 常见于动词，script 常见于相关名词；这是常见搭配规律，不是绝对规则。",
    "sources": [
      {
        "label": "subscribe",
        "url": "https://www.etymonline.com/word/subscribe"
      },
      {
        "label": "scribe / describe",
        "url": "https://www.etymonline.com/word/scribe"
      }
    ],
    "words": [
      {
        "word": "describe",
        "part": "v.",
        "meaning": "描述；描写",
        "phrase": "describe a place"
      },
      {
        "word": "description",
        "part": "n.",
        "meaning": "描述；说明",
        "phrase": "a detailed description"
      },
      {
        "word": "subscribe",
        "part": "v.",
        "meaning": "订阅；定期订购",
        "phrase": "subscribe to a magazine"
      },
      {
        "word": "subscription",
        "part": "n.",
        "meaning": "订阅；订阅费",
        "phrase": "a monthly subscription"
      },
      {
        "word": "prescription",
        "part": "n.",
        "meaning": "处方；处方药",
        "phrase": "a doctor's prescription"
      },
      {
        "word": "script",
        "part": "n.",
        "meaning": "剧本；脚本",
        "phrase": "a film script"
      },
      {
        "word": "manuscript",
        "part": "n.",
        "meaning": "手稿；原稿",
        "phrase": "submit a manuscript"
      },
      {
        "word": "transcript",
        "part": "n.",
        "meaning": "文字记录；成绩单",
        "phrase": "an academic transcript"
      },
      {
        "word": "transcribe",
        "part": "v.",
        "meaning": "转写；把录音写成文字",
        "phrase": "transcribe an interview"
      },
      {
        "word": "inscription",
        "part": "n.",
        "meaning": "题字；碑文",
        "phrase": "an inscription on a stone"
      }
    ]
  },
  "lect": {
    "title": "lect / leg",
    "meaning": "pick, gather, read · 挑选、收集、阅读",
    "note": "这一词根有“收集—挑选—阅读”的意义延伸。不要把表示“法律”的另一组 leg（如 legal）混入本组。",
    "sources": [
      {
        "label": "neglect",
        "url": "https://www.etymonline.com/word/neglect"
      },
      {
        "label": "collect",
        "url": "https://www.etymonline.com/word/collect"
      }
    ],
    "words": [
      {
        "word": "select",
        "part": "v.",
        "meaning": "选择；挑选",
        "phrase": "select a topic"
      },
      {
        "word": "selection",
        "part": "n.",
        "meaning": "选择；选集",
        "phrase": "a selection of poems"
      },
      {
        "word": "elect",
        "part": "v.",
        "meaning": "选举",
        "phrase": "elect a leader"
      },
      {
        "word": "election",
        "part": "n.",
        "meaning": "选举",
        "phrase": "a general election"
      },
      {
        "word": "collect",
        "part": "v.",
        "meaning": "收集；领取",
        "phrase": "collect information"
      },
      {
        "word": "collection",
        "part": "n.",
        "meaning": "收藏；文集",
        "phrase": "a collection of stories"
      },
      {
        "word": "collector",
        "part": "n.",
        "meaning": "收藏者；收集者",
        "phrase": "a stamp collector"
      },
      {
        "word": "recollect",
        "part": "v.",
        "meaning": "回忆起",
        "phrase": "recollect a conversation"
      },
      {
        "word": "lecture",
        "part": "n./v.",
        "meaning": "讲座；讲授",
        "phrase": "attend a lecture"
      },
      {
        "word": "intellect",
        "part": "n.",
        "meaning": "智力；理解力",
        "phrase": "a sharp intellect"
      },
      {
        "word": "intelligent",
        "part": "adj.",
        "meaning": "聪明的；有理解力的",
        "phrase": "an intelligent question"
      },
      {
        "word": "legible",
        "part": "adj.",
        "meaning": "字迹清楚可读的",
        "phrase": "legible handwriting"
      }
    ]
  },
  "peal": {
    "title": "peal → pel / puls",
    "meaning": "drive, push · 驱动、推动",
    "note": "课本以 peal 提示 appeal 的词源。常见拓展更多出现在 pel / puls 形式中；这些是历史词源联系，不是把现代单词任意拆开后直接翻译。",
    "sources": [
      {
        "label": "appeal",
        "url": "https://www.etymonline.com/word/appeal"
      },
      {
        "label": "compel",
        "url": "https://www.etymonline.com/word/compel"
      }
    ],
    "words": [
      {
        "word": "appealing",
        "part": "adj.",
        "meaning": "有吸引力的",
        "phrase": "an appealing idea"
      },
      {
        "word": "compel",
        "part": "v.",
        "meaning": "迫使",
        "phrase": "compel someone to act"
      },
      {
        "word": "compelling",
        "part": "adj.",
        "meaning": "令人信服的；引人入胜的",
        "phrase": "compelling evidence"
      },
      {
        "word": "compulsory",
        "part": "adj.",
        "meaning": "强制的；必修的",
        "phrase": "compulsory education"
      },
      {
        "word": "repel",
        "part": "v.",
        "meaning": "驱除；使退避",
        "phrase": "repel insects"
      },
      {
        "word": "repellent",
        "part": "n./adj.",
        "meaning": "驱虫剂；驱除虫害的",
        "phrase": "insect repellent"
      },
      {
        "word": "expel",
        "part": "v.",
        "meaning": "驱逐；开除",
        "phrase": "expel a student"
      },
      {
        "word": "propel",
        "part": "v.",
        "meaning": "推动；推进",
        "phrase": "propel a boat"
      },
      {
        "word": "impulse",
        "part": "n.",
        "meaning": "冲动；一时的念头",
        "phrase": "buy on impulse"
      },
      {
        "word": "impulsive",
        "part": "adj.",
        "meaning": "冲动的",
        "phrase": "an impulsive decision"
      }
    ]
  },
  "spect": {
    "title": "spect / spec",
    "meaning": "look, see · 看、观察",
    "note": "这些词的现代词义已经延伸到检查、尊重、观点等；用常见搭配帮助记忆。",
    "sources": [
      {
        "label": "spect family",
        "url": "https://www.etymonline.com/word/inspect"
      },
      {
        "label": "perspective",
        "url": "https://www.etymonline.com/word/perspective"
      }
    ],
    "words": [
      {
        "word": "inspect",
        "part": "v.",
        "meaning": "检查；查看",
        "phrase": "inspect the equipment"
      },
      {
        "word": "inspection",
        "part": "n.",
        "meaning": "检查；检验",
        "phrase": "a safety inspection"
      },
      {
        "word": "inspector",
        "part": "n.",
        "meaning": "检查员；巡视员",
        "phrase": "a school inspector"
      },
      {
        "word": "respect",
        "part": "n./v.",
        "meaning": "尊重",
        "phrase": "respect other people"
      },
      {
        "word": "respectful",
        "part": "adj.",
        "meaning": "有礼貌的；表示尊重的",
        "phrase": "a respectful tone"
      },
      {
        "word": "spectator",
        "part": "n.",
        "meaning": "观众",
        "phrase": "thousands of spectators"
      },
      {
        "word": "spectacle",
        "part": "n.",
        "meaning": "壮观的景象",
        "phrase": "an impressive spectacle"
      },
      {
        "word": "spectacular",
        "part": "adj.",
        "meaning": "壮观的；精彩的",
        "phrase": "a spectacular view"
      },
      {
        "word": "perspective",
        "part": "n.",
        "meaning": "观点；视角",
        "phrase": "a different perspective"
      },
      {
        "word": "prospect",
        "part": "n.",
        "meaning": "前景；可能性",
        "phrase": "good job prospects"
      }
    ]
  },
  "demo": {
    "title": "demo / dem",
    "meaning": "people · 人民、人群",
    "note": "demo/dem 来自希腊语 dēmos。注意日常所说的 a demo（演示）是 demonstration 的缩写，不属于这里的“人民”词根。",
    "sources": [
      {
        "label": "democracy",
        "url": "https://www.etymonline.com/word/democracy"
      },
      {
        "label": "epidemic",
        "url": "https://www.etymonline.com/word/epidemic"
      }
    ],
    "words": [
      {
        "word": "democracy",
        "part": "n.",
        "meaning": "民主；民主制度",
        "phrase": "a representative democracy"
      },
      {
        "word": "democrat",
        "part": "n.",
        "meaning": "民主主义者；民主党人",
        "phrase": "a committed democrat"
      },
      {
        "word": "democratically",
        "part": "adv.",
        "meaning": "以民主方式",
        "phrase": "a democratically elected leader"
      },
      {
        "word": "democratize",
        "part": "v.",
        "meaning": "使民主化；使大众能够使用",
        "phrase": "democratize access to education"
      },
      {
        "word": "demographic",
        "part": "adj.",
        "meaning": "人口统计的",
        "phrase": "demographic change"
      },
      {
        "word": "demographics",
        "part": "n.",
        "meaning": "人口统计资料；人口特征",
        "phrase": "study the demographics"
      },
      {
        "word": "epidemic",
        "part": "n./adj.",
        "meaning": "流行病；流行的",
        "phrase": "a flu epidemic"
      },
      {
        "word": "pandemic",
        "part": "n./adj.",
        "meaning": "大流行病；大范围流行的",
        "phrase": "a global pandemic"
      }
    ]
  },
  "mis": {
    "title": "mis / miss / mit",
    "meaning": "send, let go · 送出、释放",
    "note": "promise 中的 mis 与拉丁语 mittere 有关。不要和表示“错误地”的前缀 mis- 混淆，例如 misunderstand 不属于本组。",
    "sources": [
      {
        "label": "promise",
        "url": "https://www.etymonline.com/word/promise"
      },
      {
        "label": "mission",
        "url": "https://www.etymonline.com/word/mission"
      }
    ],
    "words": [
      {
        "word": "mission",
        "part": "n.",
        "meaning": "任务；使命",
        "phrase": "a rescue mission"
      },
      {
        "word": "admit",
        "part": "v.",
        "meaning": "承认；准许进入",
        "phrase": "admit a mistake"
      },
      {
        "word": "admission",
        "part": "n.",
        "meaning": "承认；入场许可",
        "phrase": "free admission"
      },
      {
        "word": "permit",
        "part": "v./n.",
        "meaning": "允许；许可证",
        "phrase": "permit access"
      },
      {
        "word": "permission",
        "part": "n.",
        "meaning": "许可；准许",
        "phrase": "ask for permission"
      },
      {
        "word": "submit",
        "part": "v.",
        "meaning": "提交；呈交",
        "phrase": "submit an application"
      },
      {
        "word": "submission",
        "part": "n.",
        "meaning": "提交；提交的材料",
        "phrase": "online submission"
      },
      {
        "word": "transmit",
        "part": "v.",
        "meaning": "传送；传播",
        "phrase": "transmit a signal"
      },
      {
        "word": "transmission",
        "part": "n.",
        "meaning": "传送；传播",
        "phrase": "data transmission"
      },
      {
        "word": "emit",
        "part": "v.",
        "meaning": "发出；排放",
        "phrase": "emit light"
      },
      {
        "word": "emission",
        "part": "n.",
        "meaning": "排放；排放物",
        "phrase": "carbon emissions"
      },
      {
        "word": "dismiss",
        "part": "v.",
        "meaning": "解雇；驳回；不予考虑",
        "phrase": "dismiss an idea"
      }
    ]
  },
  "cept": {
    "title": "cept / ceive",
    "meaning": "take, receive · 拿取、接受",
    "note": "两种常见形式可成对记忆，如 receive / reception、perceive / perception。accept 是“接受”，except 是“除……之外”；不要混淆。",
    "sources": [
      {
        "label": "accept",
        "url": "https://www.etymonline.com/word/accept"
      },
      {
        "label": "receive",
        "url": "https://www.etymonline.com/word/receive"
      }
    ],
    "words": [
      {
        "word": "accept",
        "part": "v.",
        "meaning": "接受",
        "phrase": "accept an invitation"
      },
      {
        "word": "acceptable",
        "part": "adj.",
        "meaning": "可接受的",
        "phrase": "an acceptable solution"
      },
      {
        "word": "acceptance",
        "part": "n.",
        "meaning": "接受；认可",
        "phrase": "gain acceptance"
      },
      {
        "word": "exception",
        "part": "n.",
        "meaning": "例外",
        "phrase": "make an exception"
      },
      {
        "word": "exceptional",
        "part": "adj.",
        "meaning": "出色的；非同一般的",
        "phrase": "exceptional ability"
      },
      {
        "word": "receive",
        "part": "v.",
        "meaning": "收到；接到",
        "phrase": "receive a message"
      },
      {
        "word": "reception",
        "part": "n.",
        "meaning": "接待；接待处",
        "phrase": "the reception desk"
      },
      {
        "word": "receptionist",
        "part": "n.",
        "meaning": "接待员",
        "phrase": "a hotel receptionist"
      },
      {
        "word": "concept",
        "part": "n.",
        "meaning": "概念；观念",
        "phrase": "a basic concept"
      },
      {
        "word": "perceive",
        "part": "v.",
        "meaning": "察觉；理解为",
        "phrase": "perceive a difference"
      },
      {
        "word": "perception",
        "part": "n.",
        "meaning": "感知；看法",
        "phrase": "public perception"
      },
      {
        "word": "intercept",
        "part": "v.",
        "meaning": "拦截；截取",
        "phrase": "intercept a pass"
      }
    ]
  }
};
