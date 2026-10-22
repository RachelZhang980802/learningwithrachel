# 十篇正文句法标签定位修复

日期：2026-10-22。针对宽屏截图、切换文章后定位偏移的问题重新检查。

## 追加：第 02 篇首句持续闪动（2026-10-22）

- 已在 Playwright WebKit 26.5 中复现：原来的原生 `rt` 标签实际计算为 `position: static`，参与正文行高和首字下沉排版。定位程序再按异常标签高度增加行距，形成反馈循环；首句高度在约 348–2,153 px 之间反复变化。Chrome 单次截图检查没有覆盖这种兼容问题。
- 将 `ruby/rt` 改为普通 `span` 与独立 `.syntax-label`，使用 flex 格式化上下文及绝对定位。按原文字符范围定位的逻辑、标签术语和颜色不变。
- 修正首字兼容条件：只有无前缀和 WebKit 前缀的 initial-letter 均不支持时，才应用浮动首字后备样式，避免两套首字规则同时生效。
- Chrome 与 WebKit 各完成十篇文章的 180 组定位检查，合计 360 组；各完成 30 组首句连续 60 帧稳定性检查。并验证标签确实脱离正文排版。
- 用户报告的第 02 篇首句在 2150 × 1282 视口持续观察 5 秒：Chrome 302 帧、WebKit 301 帧，尺寸均只有一组值，期间定位样式改写次数为 0。最终首句高度分别为 220 px、220.75 px。
- 两种浏览器各抽查 20 次生词跳转及对应 Structure 英文标签、中文解释，均通过；展开前后词条文字、底色及目标映射一致。未改动语法或词汇数据。
- 人工查看第 02 篇 WebKit 宽屏和窄屏截图，首字、正文及标签正常。自动碰撞检查排除首字大写字形包围盒中的空白下伸区；其余正文与标签仍逐项检查。
- `npm run typecheck` 通过，87 项现有回归测试通过。WebKit 测试使用独立测试内核，未直接操控用户当前的浏览器标签页。
- 复用 `scripts/check-syntax-label-layout.mjs`，可设置 `SYNTAX_BROWSER_ENGINE=webkit`；默认 Chromium，保留已有 Playwright 路径和浏览器路径配置。

## 修复

- 标签现在使用原文字符起止位置，测量对应词语的真实文本范围，不再依据跨行 ruby 盒子估算中心。
- 统一第 01–10 篇的碰撞避让；标签移到另一层时，以同色细线指向对应词语。细线考虑 Futura 字形上方的留白。
- 窗口宽度、缩放、字体加载、局部字体样式和标签展开状态改变后重新测量；连续切换文章时不会带入上一篇的展开状态。
- 标签脱离正文排版，不撑开词间距。保留现有 Futura 字体、首字放大、句法配色、中文说明和完整词组点击区域。

## 验证

- 本机 Chrome：每篇 18 组宽度／字体／缩放条件，共 180 组。宽度为 320、390、600、768、910、1280、2048；字体为 Futura、Georgia；另检查 80%、125%、150% 和恢复 100% 的 CSS 缩放。
- 每组核对每个标签与对应文本范围的横向指向（容差 2 CSS 像素），并检查标签与正文碰撞、标签互撞、隐藏、越界和页面溢出；均通过。
- 连续从 01 翻到 10，离开前保持标签展开，验证下一篇不会沿用上一篇状态；检查键盘开关、20 次生词跳转、对应 Structure 英文标签及中文说明。
- 967 个生词高亮在展开前后的文字、底色和目标信息一致。547 个句子的 1,205 处谓语范围及红／橙底色、生词内部下划线再次验证通过。
- `npm run typecheck` 通过；87 项结构、词汇、词卡及媒体回归检查通过。
- 可重复的浏览器检查脚本：[scripts/check-syntax-label-layout.mjs](scripts/check-syntax-label-layout.mjs)。可用 PLAYWRIGHT_MODULE_PATH、SYNTAX_BROWSER_PATH 指定本机已有的 Playwright 与 Chrome，默认检查 127.0.0.1:5173。

## 逐篇结果

| 文章 | 正文上方标签数 | 布局条件数 | 生词跳转抽查 | 结果 |
| --- | ---: | ---: | ---: | --- |
| 01 | 26 | 18 | 2 | 通过 |
| 02 | 30 | 18 | 2 | 通过 |
| 03 | 28 | 18 | 2 | 通过 |
| 04 | 32 | 18 | 2 | 通过 |
| 05 | 20 | 18 | 2 | 通过 |
| 06 | 62 | 18 | 2 | 通过 |
| 07 | 28 | 18 | 2 | 通过 |
| 08 | 64 | 18 | 2 | 通过 |
| 09 | 27 | 18 | 2 | 通过 |
| 10 | 47 | 18 | 2 | 通过 |

## 全部标签的原文对应

下表列出本次定位检查涉及的全部 364 个标签；完整 547 句的语法结构对应关系见 [整体逐句表](ARTICLES_01_10_STRUCTURE_AUDIT.md)。

| 文章 | 全文句号 | 对应词语 | 英文标签 | 定位检查 |
| --- | ---: | --- | --- | --- |
| 01 | 2 | that | Appositive clause | 18 组通过 |
| 01 | 2 | however | Reduced concessive clause | 18 组通过 |
| 01 | 2 | I | Relative clause | 18 组通过 |
| 01 | 6 | that | Relative clause | 18 组通过 |
| 01 | 9 | because | Reason clause | 18 组通过 |
| 01 | 9 | it | Relative clause | 18 组通过 |
| 01 | 11 | Blessed as | Concessive clause | 18 组通过 |
| 01 | 11 | that | Relative clause | 18 组通过 |
| 01 | 13 | that | Object clause | 18 组通过 |
| 01 | 14 | that | Relative clause | 18 组通过 |
| 01 | 16 | that | Object clause | 18 组通过 |
| 01 | 16 | what pages | Object clause | 18 组通过 |
| 01 | 16 | that | Relative clause | 18 组通过 |
| 01 | 17 | When | Time clause | 18 组通过 |
| 01 | 20 | that | Object clause | 18 组通过 |
| 01 | 21 | till | Time clause | 18 组通过 |
| 01 | 22 | which | Relative clause | 18 组通过 |
| 01 | 29 | As | Time clause | 18 组通过 |
| 01 | 30 | that | Object clause | 18 组通过 |
| 01 | 30 | who | Relative clause | 18 组通过 |
| 01 | 30 | as | Comparative clause | 18 组通过 |
| 01 | 30 | I | Object clause | 18 组通过 |
| 01 | 35 | when | Time clause | 18 组通过 |
| 01 | 39 | What | Subject clause | 18 组通过 |
| 01 | 39 | that | Appositive clause | 18 组通过 |
| 01 | 39 | that | Appositive clause | 18 组通过 |
| 02 | 1 | that | Object clause | 18 组通过 |
| 02 | 3 | that | Relative clause | 18 组通过 |
| 02 | 4 | If | Conditional clause | 18 组通过 |
| 02 | 4 | the European Commission | Object clause | 18 组通过 |
| 02 | 6 | that | Relative clause | 18 组通过 |
| 02 | 8 | who | Relative clause | 18 组通过 |
| 02 | 13 | that | Relative clause | 18 组通过 |
| 02 | 17 | While | Concessive clause | 18 组通过 |
| 02 | 18 | Now that | Reason clause | 18 组通过 |
| 02 | 21 | When | Time clause | 18 组通过 |
| 02 | 22 | as | Time clause | 18 组通过 |
| 02 | 25 | as | Comparative clause | 18 组通过 |
| 02 | 26 | that | Predicative clause | 18 组通过 |
| 02 | 27 | As | Parenthetical comment | 18 组通过 |
| 02 | 28 | as | Reason clause | 18 组通过 |
| 02 | 29 | Bill Gates | Relative clause | 18 组通过 |
| 02 | 30 | As | Time clause | 18 组通过 |
| 02 | 31 | what | Subject clause | 18 组通过 |
| 02 | 31 | that | Predicative clause | 18 组通过 |
| 02 | 31 | which | Relative clause | 18 组通过 |
| 02 | 36 | when | Relative clause | 18 组通过 |
| 02 | 38 | at which | Relative clause | 18 组通过 |
| 02 | 38 | that | Object clause | 18 组通过 |
| 02 | 39 | at which | Relative clause | 18 组通过 |
| 02 | 39 | at which | Relative clause | 18 组通过 |
| 02 | 42 | who | Relative clause | 18 组通过 |
| 02 | 43 | that | Cleft clause | 18 组通过 |
| 02 | 45 | at which | Relative clause | 18 组通过 |
| 02 | 46 | that | Object clause | 18 组通过 |
| 02 | 47 | when | Time clause | 18 组通过 |
| 03 | 4 | A generation after | Time clause | 18 组通过 |
| 03 | 8 | where | Relative clause | 18 组通过 |
| 03 | 11 | as | Time clause | 18 组通过 |
| 03 | 14 | as | Time clause | 18 组通过 |
| 03 | 17 | that | Relative clause | 18 组通过 |
| 03 | 18 | even | Reduced concessive clause | 18 组通过 |
| 03 | 20 | As | Time clause | 18 组通过 |
| 03 | 25 | as | Time clause | 18 组通过 |
| 03 | 26 | you | Relative clause | 18 组通过 |
| 03 | 27 | that | Relative clause | 18 组通过 |
| 03 | 29 | When | Time clause | 18 组通过 |
| 03 | 31 | he | Relative clause | 18 组通过 |
| 03 | 32 | that | Subject clause | 18 组通过 |
| 03 | 38 | what | Predicative clause | 18 组通过 |
| 03 | 42 | what | Object clause | 18 组通过 |
| 03 | 43 | that | Object clause | 18 组通过 |
| 03 | 46 | Though | Reduced concessive clause | 18 组通过 |
| 03 | 48 | Now that | Reason clause | 18 组通过 |
| 03 | 49 | that | Subject clause | 18 组通过 |
| 03 | 49 | who | Relative clause | 18 组通过 |
| 03 | 50 | when | Time clause | 18 组通过 |
| 03 | 53 | as | Comparative clause | 18 组通过 |
| 03 | 55 | where | Relative clause | 18 组通过 |
| 03 | 57 | what | Object clause | 18 组通过 |
| 03 | 58 | as | Parenthetical comment | 18 组通过 |
| 03 | 59 | Although | Concessive clause | 18 组通过 |
| 03 | 62 | how much | Object clause | 18 组通过 |
| 03 | 65 | even if | Conditional clause | 18 组通过 |
| 04 | 3 | while | Time clause | 18 组通过 |
| 04 | 4 | the men's faces | Absolute construction | 18 组通过 |
| 04 | 4 | while | Time clause | 18 组通过 |
| 04 | 7 | When | Time clause | 18 组通过 |
| 04 | 8 | which | Relative clause | 18 组通过 |
| 04 | 12 | though | Concessive clause | 18 组通过 |
| 04 | 12 | with whom | Relative clause | 18 组通过 |
| 04 | 13 | As | Reason clause | 18 组通过 |
| 04 | 13 | he | Relative clause | 18 组通过 |
| 04 | 14 | that | Object clause | 18 组通过 |
| 04 | 19 | although | Concessive clause | 18 组通过 |
| 04 | 19 | that | Object clause | 18 组通过 |
| 04 | 23 | he | Object clause | 18 组通过 |
| 04 | 25 | though | Reduced concessive clause | 18 组通过 |
| 04 | 26 | Even though | Concessive clause | 18 组通过 |
| 04 | 30 | so that | Result clause | 18 组通过 |
| 04 | 33 | he | Object clause | 18 组通过 |
| 04 | 35 | where | Relative clause | 18 组通过 |
| 04 | 36 | as | Reason clause | 18 组通过 |
| 04 | 38 | (I | Parenthetical comment | 18 组通过 |
| 04 | 38 | most Englishmen | Object clause | 18 组通过 |
| 04 | 39 | he | Content clause | 18 组通过 |
| 04 | 48 | while | Time clause | 18 组通过 |
| 04 | 53 | as if | Comparative clause | 18 组通过 |
| 04 | 56 | who | Relative clause | 18 组通过 |
| 04 | 56 | if | Conditional clause | 18 组通过 |
| 04 | 57 | though | Concessive clause | 18 组通过 |
| 04 | 57 | he | Object clause | 18 组通过 |
| 04 | 60 | why | Predicative clause | 18 组通过 |
| 04 | 64 | while | Time clause | 18 组通过 |
| 04 | 66 | If | Reduced conditional clause | 18 组通过 |
| 04 | 74 | that | Relative clause | 18 组通过 |
| 05 | 3 | Had | Conditional clause | 18 组通过 |
| 05 | 3 | had | Conditional clause | 18 组通过 |
| 05 | 5 | while | Time clause | 18 组通过 |
| 05 | 13 | as | Time clause | 18 组通过 |
| 05 | 18 | you | Object clause | 18 组通过 |
| 05 | 21 | As | Time clause | 18 组通过 |
| 05 | 21 | his hands | Absolute construction | 18 组通过 |
| 05 | 21 | a black cap | Absolute construction | 18 组通过 |
| 05 | 21 | a yellow oil-paper umbrella | Absolute construction | 18 组通过 |
| 05 | 34 | I | Parenthetical comment | 18 组通过 |
| 05 | 38 | how | Object clause | 18 组通过 |
| 05 | 38 | that | Relative clause | 18 组通过 |
| 05 | 39 | how | Predicative clause | 18 组通过 |
| 05 | 40 | how | Predicative clause | 18 组通过 |
| 05 | 41 | Even though | Concessive clause | 18 组通过 |
| 05 | 49 | because | Reason clause | 18 组通过 |
| 05 | 51 | If | Conditional clause | 18 组通过 |
| 05 | 56 | I | Object clause | 18 组通过 |
| 05 | 60 | If | Conditional clause | 18 组通过 |
| 05 | 71 | he | Object clause | 18 组通过 |
| 06 | 1 | that | Relative clause | 18 组通过 |
| 06 | 4 | most of which | Relative clause | 18 组通过 |
| 06 | 4 | that | Object clause | 18 组通过 |
| 06 | 4 | when | Relative clause | 18 组通过 |
| 06 | 4 | since | Reason clause | 18 组通过 |
| 06 | 4 | I | Subject clause | 18 组通过 |
| 06 | 5 | in which | Relative clause | 18 组通过 |
| 06 | 6 | which | Relative clause | 18 组通过 |
| 06 | 6 | that | Relative clause | 18 组通过 |
| 06 | 7 | though | Concessive clause | 18 组通过 |
| 06 | 11 | when | Time clause | 18 组通过 |
| 06 | 12 | till | Time clause | 18 组通过 |
| 06 | 15 | which | Relative clause | 18 组通过 |
| 06 | 16 | when | Time clause | 18 组通过 |
| 06 | 16 | lest | Purpose clause | 18 组通过 |
| 06 | 17 | who | Relative clause | 18 组通过 |
| 06 | 17 | who | Relative clause | 18 组通过 |
| 06 | 17 | as | Relative clause | 18 组通过 |
| 06 | 18 | it | Object clause | 18 组通过 |
| 06 | 20 | when | Time clause | 18 组通过 |
| 06 | 21 | the event | Absolute construction | 18 组通过 |
| 06 | 22 | verse-makers | Object clause | 18 组通过 |
| 06 | 23 | as | Reason clause | 18 组通过 |
| 06 | 23 | how | Object clause | 18 组通过 |
| 06 | 23 | what little ability | Fused relative clause | 18 组通过 |
| 06 | 24 | with whom | Relative clause | 18 组通过 |
| 06 | 25 | which disputatious turn | Relative clause | 18 组通过 |
| 06 | 25 | that | Relative clause | 18 组通过 |
| 06 | 25 | where | Place clause | 18 组通过 |
| 06 | 27 | I | Parenthetical comment | 18 组通过 |
| 06 | 27 | that | Relative clause | 18 组通过 |
| 06 | 29 | that | Appositive clause | 18 组通过 |
| 06 | 29 | that | Appositive clause | 18 组通过 |
| 06 | 31 | as | Parenthetical comment | 18 组通过 |
| 06 | 32 | As | Reason clause | 18 组通过 |
| 06 | 32 | which | Relative clause | 18 组通过 |
| 06 | 34 | when | Time clause | 18 组通过 |
| 06 | 35 | that | Object clause | 18 组通过 |
| 06 | 35 | though | Concessive clause | 18 组通过 |
| 06 | 35 | (which | Relative clause | 18 组通过 |
| 06 | 35 | of which | Relative clause | 18 组通过 |
| 06 | 41 | if | Reduced conditional clause | 18 组通过 |
| 06 | 42 | as | Comparative clause | 18 组通过 |
| 06 | 42 | that | Relative clause | 18 组通过 |
| 06 | 44 | I | Object clause | 18 组通过 |
| 06 | 44 | which | Relative clause | 18 组通过 |
| 06 | 44 | I | Object clause | 18 组通过 |
| 06 | 44 | if | Conditional clause | 18 组通过 |
| 06 | 44 | since | Reason clause | 18 组通过 |
| 06 | 45 | when | Time clause | 18 组通过 |
| 06 | 46 | before | Time clause | 18 组通过 |
| 06 | 48 | that | Object clause | 18 组通过 |
| 06 | 48 | I | Object clause | 18 组通过 |
| 06 | 48 | of which | Relative clause | 18 组通过 |
| 06 | 49 | before | Time clause | 18 组通过 |
| 06 | 49 | when | Relative clause | 18 组通过 |
| 06 | 49 | as | Comparative clause | 18 组通过 |
| 06 | 49 | which | Relative clause | 18 组通过 |
| 06 | 49 | when | Time clause | 18 组通过 |
| 06 | 49 | which | Relative clause | 18 组通过 |
| 06 | 49 | though | Concessive clause | 18 组通过 |
| 06 | 49 | as | Parenthetical comment | 18 组通过 |
| 07 | 3 | some of which | Relative clause | 18 组通过 |
| 07 | 10 | when | Relative clause | 18 组通过 |
| 07 | 12 | that | Content clause | 18 组通过 |
| 07 | 13 | lest | Purpose clause | 18 组通过 |
| 07 | 15 | whenever | Time clause | 18 组通过 |
| 07 | 17 | that | Relative clause | 18 组通过 |
| 07 | 19 | that | Relative clause | 18 组通过 |
| 07 | 19 | that | Relative clause | 18 组通过 |
| 07 | 23 | where | Relative clause | 18 组通过 |
| 07 | 24 | in which | Relative clause | 18 组通过 |
| 07 | 27 | no questions | Absolute construction | 18 组通过 |
| 07 | 28 | because | Reason clause | 18 组通过 |
| 07 | 30 | whence | Relative clause | 18 组通过 |
| 07 | 34 | where | Relative clause | 18 组通过 |
| 07 | 35 | where | Place clause | 18 组通过 |
| 07 | 36 | How | Exclamative fragment | 18 组通过 |
| 07 | 37 | When | Time clause | 18 组通过 |
| 07 | 37 | their friends | Absolute construction | 18 组通过 |
| 07 | 40 | that | Object clause | 18 组通过 |
| 07 | 41 | what | Object clause | 18 组通过 |
| 07 | 42 | who | Relative clause | 18 组通过 |
| 07 | 42 | because | Reason clause | 18 组通过 |
| 07 | 42 | (as | Parenthetical comment | 18 组通过 |
| 07 | 43 | because | Reason clause | 18 组通过 |
| 07 | 47 | As | Time clause | 18 组通过 |
| 07 | 48 | If | Conditional clause | 18 组通过 |
| 07 | 48 | that | Relative clause | 18 组通过 |
| 07 | 48 | you | Relative clause | 18 组通过 |
| 08 | 2 | like | Predicative clause | 18 组通过 |
| 08 | 2 | whenever | Time clause | 18 组通过 |
| 08 | 4 | When | Reduced time clause | 18 组通过 |
| 08 | 4 | where | Relative clause | 18 组通过 |
| 08 | 6 | it | Appositive clause | 18 组通过 |
| 08 | 6 | when | Fused relative clause | 18 组通过 |
| 08 | 8 | I | Relative clause | 18 组通过 |
| 08 | 9 | when | Time clause | 18 组通过 |
| 08 | 10 | when | Time clause | 18 组通过 |
| 08 | 10 | what | Subject clause | 18 组通过 |
| 08 | 10 | what | Subject clause | 18 组通过 |
| 08 | 11 | when | Predicative clause | 18 组通过 |
| 08 | 11 | that | Relative clause | 18 组通过 |
| 08 | 14 | if | Conditional clause | 18 组通过 |
| 08 | 16 | when | Time clause | 18 组通过 |
| 08 | 16 | when | Time clause | 18 组通过 |
| 08 | 17 | When | Time clause | 18 组通过 |
| 08 | 17 | when | Time clause | 18 组通过 |
| 08 | 17 | culture | Object clause | 18 组通过 |
| 08 | 17 | where | Predicative clause | 18 组通过 |
| 08 | 18 | when | Time clause | 18 组通过 |
| 08 | 19 | that | Relative clause | 18 组通过 |
| 08 | 19 | when | Time clause | 18 组通过 |
| 08 | 20 | when | Time clause | 18 组通过 |
| 08 | 21 | where | Relative clause | 18 组通过 |
| 08 | 22 | While | Concessive clause | 18 组通过 |
| 08 | 22 | that | Relative clause | 18 组通过 |
| 08 | 23 | While | Concessive clause | 18 组通过 |
| 08 | 23 | what | Fused relative clause | 18 组通过 |
| 08 | 23 | that | Predicative clause | 18 组通过 |
| 08 | 28 | whether | Reduced concessive clause | 18 组通过 |
| 08 | 29 | what | Object clause | 18 组通过 |
| 08 | 30 | "Oh, | Quoted main clause | 18 组通过 |
| 08 | 34 | If | Conditional clause | 18 组通过 |
| 08 | 34 | it | Object clause | 18 组通过 |
| 08 | 35 | If | Conditional clause | 18 组通过 |
| 08 | 35 | that | Relative clause | 18 组通过 |
| 08 | 39 | When | Time clause | 18 组通过 |
| 08 | 39 | it | Relative clause | 18 组通过 |
| 08 | 40 | that | Relative clause | 18 组通过 |
| 08 | 41 | where | Relative clause | 18 组通过 |
| 08 | 41 | they | Relative clause | 18 组通过 |
| 08 | 42 | that | Object clause | 18 组通过 |
| 08 | 42 | that | Relative clause | 18 组通过 |
| 08 | 43 | how | Object clause | 18 组通过 |
| 08 | 45 | that | Relative clause | 18 组通过 |
| 08 | 45 | that | Relative clause | 18 组通过 |
| 08 | 46 | they | Relative clause | 18 组通过 |
| 08 | 47 | they | Relative clause | 18 组通过 |
| 08 | 48 | when | Fused relative clause | 18 组通过 |
| 08 | 49 | that | Relative clause | 18 组通过 |
| 08 | 49 | who | Predicative clause | 18 组通过 |
| 08 | 52 | that | Relative clause | 18 组通过 |
| 08 | 53 | when | Predicative clause | 18 组通过 |
| 08 | 54 | that | Relative clause | 18 组通过 |
| 08 | 54 | they | Relative clause | 18 组通过 |
| 08 | 55 | which | Relative clause | 18 组通过 |
| 08 | 59 | where | Relative clause | 18 组通过 |
| 08 | 60 | that | Object clause | 18 组通过 |
| 08 | 61 | if | Conditional clause | 18 组通过 |
| 08 | 63 | how | Object clause | 18 组通过 |
| 08 | 63 | that | Relative clause | 18 组通过 |
| 08 | 65 | that | Relative clause | 18 组通过 |
| 08 | 65 | that | Relative clause | 18 组通过 |
| 09 | 1 | who | Relative clause | 18 组通过 |
| 09 | 2 | that | Relative clause | 18 组通过 |
| 09 | 4 | If | Conditional clause | 18 组通过 |
| 09 | 7 | that | Relative clause | 18 组通过 |
| 09 | 12 | that | Relative clause | 18 组通过 |
| 09 | 12 | when | Time clause | 18 组通过 |
| 09 | 23 | when | Time clause | 18 组通过 |
| 09 | 25 | which | Relative clause | 18 组通过 |
| 09 | 26 | until | Time clause | 18 组通过 |
| 09 | 28 | that | Object clause | 18 组通过 |
| 09 | 31 | I | Relative clause | 18 组通过 |
| 09 | 34 | when | Time clause | 18 组通过 |
| 09 | 35 | when | Time clause | 18 组通过 |
| 09 | 35 | because | Reason clause | 18 组通过 |
| 09 | 35 | where | Object clause | 18 组通过 |
| 09 | 38 | lest | Purpose clause | 18 组通过 |
| 09 | 39 | when | Relative clause | 18 组通过 |
| 09 | 41 | that | Predicative clause | 18 组通过 |
| 09 | 41 | that | Predicative clause | 18 组通过 |
| 09 | 41 | that | Appositive clause | 18 组通过 |
| 09 | 42 | that | Relative clause | 18 组通过 |
| 09 | 44 | Now | Reason clause | 18 组通过 |
| 09 | 44 | which, | Relative clause | 18 组通过 |
| 09 | 48 | since | Time clause | 18 组通过 |
| 09 | 48 | since | Time clause | 18 组通过 |
| 09 | 48 | where | Relative clause | 18 组通过 |
| 09 | 49 | something | Object clause | 18 组通过 |
| 10 | 1 | that | Relative clause | 18 组通过 |
| 10 | 1 | which | Relative clause | 18 组通过 |
| 10 | 1 | as if | Manner clause | 18 组通过 |
| 10 | 3 | that | Relative clause | 18 组通过 |
| 10 | 3 | that | Relative clause | 18 组通过 |
| 10 | 3 | that | Relative clause | 18 组通过 |
| 10 | 3 | you | Object clause | 18 组通过 |
| 10 | 4 | whose | Relative clause | 18 组通过 |
| 10 | 5 | who | Relative clause | 18 组通过 |
| 10 | 5 | when | Relative clause | 18 组通过 |
| 10 | 5 | that | Object clause | 18 组通过 |
| 10 | 5 | that | Relative clause | 18 组通过 |
| 10 | 5 | that | Relative clause | 18 组通过 |
| 10 | 6 | the water | Relative clause | 18 组通过 |
| 10 | 7 | who | Relative clause | 18 组通过 |
| 10 | 7 | whereas | Contrast clause | 18 组通过 |
| 10 | 8 | when | Time clause | 18 组通过 |
| 10 | 8 | that | Relative clause | 18 组通过 |
| 10 | 8 | as | Comparative clause | 18 组通过 |
| 10 | 10 | which | Relative clause | 18 组通过 |
| 10 | 10 | while | Time clause | 18 组通过 |
| 10 | 12 | which | Relative clause | 18 组通过 |
| 10 | 12 | when | Time clause | 18 组通过 |
| 10 | 13 | through which | Relative clause | 18 组通过 |
| 10 | 13 | that | Relative clause | 18 组通过 |
| 10 | 13 | where | Place clause | 18 组通过 |
| 10 | 13 | that | Relative clause | 18 组通过 |
| 10 | 13 | that | Relative clause | 18 组通过 |
| 10 | 13 | that | Relative clause | 18 组通过 |
| 10 | 13 | that | Relative clause | 18 组通过 |
| 10 | 13 | that | Relative clause | 18 组通过 |
| 10 | 18 | as | Parenthetical comment | 18 组通过 |
| 10 | 18 | when | Relative clause | 18 组通过 |
| 10 | 18 | which | Relative clause | 18 组通过 |
| 10 | 18 | when | Relative clause | 18 组通过 |
| 10 | 19 | if | Conditional clause | 18 组通过 |
| 10 | 19 | that | Object clause | 18 组通过 |
| 10 | 19 | that | Object clause | 18 组通过 |
| 10 | 19 | which | Relative clause | 18 组通过 |
| 10 | 19 | if | Conditional clause | 18 组通过 |
| 10 | 19 | that | Appositive clause | 18 组通过 |
| 10 | 19 | he | Relative clause | 18 组通过 |
| 10 | 21 | any feature | Relative clause | 18 组通过 |
| 10 | 21 | it | Relative clause | 18 组通过 |
| 10 | 23 | that | Relative clause | 18 组通过 |
| 10 | 24 | what | Fused relative clause | 18 组通过 |
| 10 | 26 | whether | Object clause | 18 组通过 |
