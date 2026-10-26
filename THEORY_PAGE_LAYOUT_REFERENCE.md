# 当前执行规则：原课件内容与互动页面（2026-10-26）

本节记录用户最新要求，优先于下方历史方案。

- 入口为 Narrative Writing → Units → 对应单元；`#unit-one` 至 `#unit-six` 及各自 `-knowledge` 地址均进入课件阅读器。
- 外层仅保留导航。所选课件内容作为主体，保留各单元原有配色、插图、背景与强调色；正文为原生 HTML，不用整页截图代替可交互文字。
- 原稿/PDF 导出中已有的重叠、越界和裁切也要整理：完整可读且不遮挡优先于机械保留错误坐标。不得删减正文来解决空间问题。
- 点击原文显示对应中文释义。中文放在不覆盖课件的独立区域；恢复自图片的文字按完整上下文显示释义。可选 Recall English 模式按原文本框逐一揭示英文。
- Unit 2、3 的 Characters / Settings 导航保留此前加入的 Descriptosaurus 参考内容。

选页按源文件物理页码：

| 单元 | 页码 | 页数 |
| --- | --- | --- |
| Unit 1 | 22–24、42–47、57、145–156（与此前课程内容对应） | 22 |
| Unit 2 | 1–16、19–21、23–27、35–43、110–118 | 42 |
| Unit 3 | 1–20、22–34、36–37 | 35 |
| Unit 4 | 1–56、100–106 | 63 |
| Unit 5 | 1–18、22–33、161–175、177–186 | 55 |
| Unit 6 | 1–19、66–77 | 31 |

Unit 4 经用户确认使用原 PDF，其余使用 PPTX 对应内容。

实现入口：`app/UnitDeckViewer.tsx`；选页目录：`app/unitDeckSources.json`；单元数据按需加载于 `public/narrative-course/decks/`。原稿转换：`scripts/convert-unit-decks.py`；释义字典：`app/unitDeckGlossary.json`、`app/unitDeckGlossaryById.json`。不要重新启用下方历史整页图片/额外标题方案。

故事书：98 页原书内容保留；创作与中文切换限定在明确的写作框或漫画气泡内。无可写空白框的页面从导航打开独立范例区；长文在对应框内部滚动，不遮盖原文或插图。

---

以下内容为历史记录，发生冲突时以上述最新规则为准。

# 单元理论知识页：导航与排版逻辑

以第一单元现有页面为参考，供第二单元排版时复用。重点是**页面层级、导航行为和内容容器**；第二单元的栏目及教学内容仍以该单元材料决定。

## 1. 页面层级和进出路径

```text
课程导航 Units
  └─ Unit One 单元封面（#unit-one）
       ├─ Start unit → 阅读文本
       ├─ View readings → 阅读列表
       └─ View theoretical knowledge → 理论知识页（#unit-one-knowledge）
                                      └─ 左上 Back to unit → 单元封面
```

- **单元封面是入口层**：只承担单元主题、进入阅读和进入理论知识的分流。理论内容不堆在封面上。
- **理论知识页是独立层**：进入后隐藏课程的全局顶部导航，保留左上角返回单元封面的按钮；内部使用自己的栏目导航。
- **路由用 URL hash**：第一单元封面和理论页分别是 `#unit-one`、`#unit-one-knowledge`。第二单元应有自己的独立路由，不能复用这两个地址。

## 2. 理论知识页的固定骨架

```text
┌──────────────────────────────────────────────────────────────┐
│ ← Back to unit                                               │
│      [学习目标] [目录] [基础概念] [核心要素] [语言/细节]      │ ← 一级导航
│                                                              │
│                    栏目引题                                  │
│                    栏目主标题                                │
│                                                              │
│                    当前栏目内容                              │
│                    （必要时有二级导航）                      │
└──────────────────────────────────────────────────────────────┘
```

**顺序固定**：返回按钮 → 一级导航条 → 当前面板的小引题和大标题 → 当前面板的内容。一级导航始终放在内容上方，不能随面板切换改变位置。所有面板共用同一内容区域；一次只显示一个面板，不纵向堆叠全部栏目。

一级导航是浅色圆角长条，当前项为深色实心胶囊；未选中项保持清晰可点。当前选中状态由文字与底色共同表达。桌面端栏目横排，窄屏允许换行，不能缩到难以点击或让文字互相覆盖。

## 3. 内容如何挂在导航下面

| 一级栏目当前实例 | 内容区域的排版类型 | 是否有二级导航 |
| --- | --- | --- |
| Learning Objectives | 居中引导语 + 纵向目标清单，关键动作词突出 | 否 |
| Content | 带圆形编号的目录；桌面双列，窄屏单列 | 否 |
| Narrative Basics | 标题下面是三项横向子标签，再往下是一张内容页 | 是：Definition / Subgenres / Basic Structure |
| Narrative Elements | 一排可选编号卡，下面是所选概念的解释区 | 是：五张概念卡 |
| Language & Detail | 较短的编号目录 | 否 |

二级导航**属于当前一级面板**，不能放到页面总导航里。“Narrative Basics”切换子标签时，只更新下方那张内容页；“Narrative Elements”点选卡片时，只更新下面的概念解释区。概念解释区由编号、名称、短说明和详细内容组成。第二单元如没有对应内容，不需要硬塞这两种二级导航。

## 4. 页面状态与操作规则

- 初次进入理论页默认打开第一个一级栏目；有二级导航的面板默认选第一项。
- 点击一级标签只切换栏目内容，页面地址仍停留在同一个理论页；返回按钮才回到单元封面。
- `tablist` 中一次只选中一个 `tab`，只显示其 `tabpanel`；同步 `aria-selected`、`hidden` 和焦点顺序。
- 一级栏目与基础概念子标签支持左右方向键、Home、End；概念卡还支持上下方向键。点击和键盘切换应得到同样的内容。
- 面板内容可能比一屏长；应自然向下滚动，不能裁切。切换后导航仍处于内容之前，版面不因不同内容高度而相互覆盖。

## 5. 宽度与响应式排布

- 桌面理论正文宽度上限约 900px；导航与面板共用这条主轴。返回按钮在左上，和正文主轴分开。
- 约 `821–1050px`：正文居中并向下留出更多空间，避免返回按钮碰到导航条。
- `≤820px`：两侧留约 20px；一级导航允许换行；目录转单列；基础概念中的并排说明转单列；概念卡由横排转两列或跨列，详细内容转单列。
- 标题、栏目名和卡片文字允许换行，不以固定高度强迫内容裁切。装饰图放在内容层之后，不挡返回按钮、导航和正文。

## 6. 第二单元复用时的实现要点

先确定第二单元的“单元封面 → 理论知识页 → 一级栏目 → 必要时二级栏目”信息结构，再填对应内容。保持页面骨架和切换逻辑一致，但栏目名称、数量、概念卡和图例都由第二单元材料决定。

目前第一单元的路由、标签数据属性和 CSS 类名均以 `unit-one` 命名，主要写在 `app/NarrativeWritingCourse.tsx`、`app/narrativeWritingMarkup.ts`、`app/narrative-writing.css` 中。第二单元实施时应抽取可复用组件或建立独立的 `unit-two` 路由与数据，避免两个单元共享选中状态、返回目标或面板 ID。

完成后重点核对三条路径：从第二单元封面进入理论页、在一级及二级导航之间切换、返回第二单元封面；再分别用桌面和窄屏检查换行、滚动与遮挡。

## 视觉辅助规则

现有页面使用亚麻纸纹、细红框、红色衬线标题与暖棕色选中态。这些元素建立同一课程的外观，但导航层级和内容排布是第二单元最需要延续的部分。

## 7. 第一单元作为“复刻”的判据

2026-10-20 对照 Unit 1 原 PPTX 的封面、目录、目标、概念页与现有网页后，明确以下标准：

- 网页应保留**该单元课件自身**的图像、色彩、字体气质和信息层级；不能把第一单元的亚麻纸纹或同一套通用卡片直接铺到其余单元。
- 原课件的核心定义、例子、练习和步骤应成为可选中、可阅读的网页内容。课件原页用于核对或承载无法转写的图示，不能成为整节课唯一的主体。
- 导航沿用第一单元的“单元封面 → 独立知识页 → 一级栏目 → 必要时二级交互”逻辑，但栏目和顺序必须服从该单元原课件。
- 视觉复刻不等于保留原课件的排版事故。原页中重叠或截断的文字应按源文件语义重新排开；对内容本身的改写和纠错需可追溯，不可悄悄补造材料。
- 验收同时看桌面与窄屏：文字不裁切、图文不遮挡、目录可达、每个选定页码有可核对的来源。

各单元的视觉母题分别为：Unit 3 的暖黄点纹与学生插画，Unit 4 的羊皮纸与红色双框，Unit 5 的软木板与彩色便签，Unit 6 的软木板、活页纸与黄色便签。

## 8. Unit 3–6 的最新呈现选择

用户随后明确要求把课件图片直接放在网页正文里，并删除单独的 “Original page” 入口。这条要求优先于第 7 节关于正文必须逐页转成原生文字版式的建议：Unit 3–6 保留网页导航与各自单元封面，目录、学习目标及所选教学页直接显示源页图片；图片下方提供可展开的文字版，供窄屏阅读、复制与辅助技术使用。课件本身已有的拼写或排版问题会随图片呈现，不应把它误报成网页的错位。

Unit 3 第 13 页的中文诗句在源页转图时变成缺字方框；网页用 PPTX 中的原始文字在图片上覆盖恢复。所有课件图片都应在正文中可见，而不是藏在“对照原页”的折叠区里。


## 9. Unit 3 原生 HTML（2026-10-26）

用户最新要求将 Unit 3 理论页全部按原稿还原为 HTML，取代第 8 节中 Unit 3 的整页图片方案。所选 34 页（2–20、22–34、36–37）使用 PPTX 的原始文本、富文本颜色、坐标和独立插图生成，文字为可选中的 HTML，装饰与插图使用独立 SVG/图像素材。沿用现有四个标签、页码和前后翻页；Unit 4–6 不变。

生成器：`scripts/convert-unit-three.py`；网页内容：`app/unitThreeNativeSlides.json`；样式：`app/unit-three-native.css`；来源核对：`docs/unit-three-native-audit.json`。窄屏保持原稿比例，可在页面内部横向滚动。独立 HTML：`public/narrative-course/theory/unit-3/html/lesson.html`。


### Unit 3 后续交互调整

按用户要求删除第 3 页内部重复的 Teaching Objectives 标题，保留页面外层标题。第 5–20 页的英文描述与引用（第 13 页中文诗除外），以及第 31、32、33、37 页的引用，共 21 段，使用原生 details/summary 点击显隐：中文紧接对应英文，在同一段内自然换行。源课件已有译文移入该交互，不再单独常显；无译文的 8 段使用 `app/unitThreeQuoteTranslations.json` 中的辅助翻译。`app/unitThreeInteractions.js` 让展开内容增加页面高度并推开后续图文，折叠后恢复原排版。生成器同步更新网页与独立 HTML。

### Unit 4–6 native theory pages (2026-10-26)

The selected theory pages in Units 4, 5 and 6 now use native, selectable HTML text in the original slide coordinates. Their source artwork is stored as text-free SVG with separate image assets in `public/narrative-course/theory/native/`; the browser loads each SVG only when its page enters view. The source inventory and text counts are in `docs/unit-theory-native-audit.json`.

Regenerate with `PYTHONPATH=/private/tmp/native-slides-libs python3 scripts/convert-unit-theory-native.py` after converting the Unit 5 and 6 PPTX files to PDF using LibreOffice. `app/unitTheoryImageText.json` holds the visible HTML transcription of 25 source pages whose PDF text layer is empty because the source text is baked into illustrations. Review those transcriptions against the source before editing; the original artwork remains alongside them.

Unit 3 page 18 uses a scoped smaller English font in `app/unit-three-native.css`. Regenerate its standalone `lesson.html` after CSS changes with `scripts/convert-unit-three.py`.
