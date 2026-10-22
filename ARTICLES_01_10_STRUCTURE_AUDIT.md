# 第 01–10 篇 Text / Structure 整体一致性核对

核对日期：2026-10-22。针对当前本地页面与当前代码重新执行，未将前次结果直接当成本次结果。

## 结论

已遍历 547 个 Structure 页面，核对 1056 个结构框和 1205 处谓语标记。英文语法标签与正文对应，跨文章相同概念配色一致；中文说明均存在。967 个生词高亮的文字、底色和原有目标映射与各篇修改前基线一致。

实际点击 106 个生词入口，覆盖十篇、普通状态及展开句法状态，并包含与谓语重叠的词组；所选词卡和全文句号正确。没有把全部 967 个入口都表述为逐一点击。

## 本次验证范围

- 结构与词汇相关自动检查：79 项通过（结构同步 61 项，01–05 词汇及完整性 5 项，06–10 词汇 13 项）。
- 浏览器逐页检查：句子身份、原文覆盖、结构框英文标签与实际颜色、谓语角色与颜色、中文说明；各句无丢字或重复。
- 正文谓语：十篇所有句子按字符逐一比对实际渲染的谓语范围、红／橙底色及生词内部下划线颜色。
- 正文排版：每篇全部展开后，在 320、390、600、768、910、1280 像素宽度检查标签碰撞、越界及横向溢出；另验证句号键盘开关。
- Structure 手机布局：每篇首句、中间句和末句，共 30 页，检查 390 像素宽度横向溢出并保存截图。所有 547 页在桌面宽度核对。
- 生词保留：全部高亮与原始基线比较；实际跳转为下表抽样数量。原有音频、译文及词卡映射同时由专项数据检查验证。
- 第 09 篇插入语的绿色显示括号属于句法辅助符号，核对原文字符时单独排除；其内容未写回原文。
- 后续更新（2026-10-22）：原有 13 条 TypeScript 报错已修复。`npm run typecheck` 同时检查前端与 Worker，结果均为 0 报错；87 项回归测试及全部 547 页浏览器复查通过。详见 [修复与复查报告](TYPESCRIPT_REPAIR_AUDIT.md)。

## 分篇结果

| 文章 | 句数 | 结构框 | 谓语标记 | 高亮数 | 实际跳转抽查 | 结果 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| [01](http://127.0.0.1:5173/?open=reading&article=01#text) | 40 | 80 | 94 | 62 | 11 | 通过 |
| [02](http://127.0.0.1:5173/?open=reading&article=02#text) | 48 | 86 | 98 | 55 | 10 | 通过 |
| [03](http://127.0.0.1:5173/?open=reading&article=03#text) | 66 | 114 | 129 | 85 | 10 | 通过 |
| [04](http://127.0.0.1:5173/?open=reading&article=04#text) | 75 | 132 | 149 | 69 | 11 | 通过 |
| [05](http://127.0.0.1:5173/?open=reading&article=05#text) | 80 | 110 | 109 | 78 | 11 | 通过 |
| [06](http://127.0.0.1:5173/?open=reading&article=06#text) | 49 | 125 | 168 | 156 | 11 | 通过 |
| [07](http://127.0.0.1:5173/?open=reading&article=07#text) | 48 | 84 | 91 | 145 | 11 | 通过 |
| [08](http://127.0.0.1:5173/?open=reading&article=08#text) | 65 | 138 | 158 | 145 | 10 | 通过 |
| [09](http://127.0.0.1:5173/?open=reading&article=09#text) | 50 | 86 | 94 | 86 | 11 | 通过 |
| [10](http://127.0.0.1:5173/?open=reading&article=10#text) | 26 | 101 | 115 | 86 | 10 | 通过 |

## 跨文章配色

| 英文概念 | 色值 |
| --- | --- |
| Main clause predicate | `#ff2500` |
| Subordinate clause predicate | `#feb72e` |
| Main clause | `#ff2500` |
| Relative clause | `#e9a300` |
| Manner clause | `#45abe5` |
| Object clause | `#f3484e` |
| Contrast clause | `#333333` |
| Time clause | `#68ab00` |
| Comparative clause | `#00cb00` |
| Place clause | `#68ab00` |
| Parenthetical comment | `#3bbe0f` |
| Conditional clause | `#45abe5` |
| Appositive clause | `#1515ee` |
| Fused relative clause | `#746958` |
| Reduced concessive clause | `#746958` |
| Reason clause | `#ed00ed` |
| Concessive clause | `#746958` |
| Reporting clause | `#ff2500` |
| Quoted main clause | `#ff2500` |
| Sentence fragment | `#746958` |
| Subject clause | `#746958` |
| Predicative clause | `#00cb00` |
| Cleft clause | `#746958` |
| Absolute construction | `#746958` |
| Elliptical main clause | `#ff2500` |
| Result clause | `#746958` |
| Content clause | `#746958` |
| Reduced conditional clause | `#45abe5` |
| Quoted fragment | `#746958` |
| Vocative fragment | `#746958` |
| Purpose clause | `#ed00ed` |
| Exclamative fragment | `#746958` |
| Reduced time clause | `#68ab00` |
| Quoted imperative | `#ff2500` |
| Elliptical continuation | `#ff2500` |
| Imperative clause | `#ff2500` |

## 逐句对应表

每行的“通过”包括：正文与 Structure 身份、原文范围、英文结构标签、实际配色及中文说明。结构语法依据和中文解释详见各篇既有逐句报告。

### Article 01

[详细语法核对说明](ARTICLE_01_STRUCTURE_AUDIT.md)

| 全文句号 | 段内位置 | 结构类型 | 结构框 / 谓语 | 结果 |
| --- | --- | --- | --- | --- |
| 01 | 01 [1] | Main clause | 1 / 1 | 通过 |
| 02 | 01 [2] | Main clause, Appositive clause, Reduced concessive clause, Relative clause | 6 / 6 | 通过 |
| 03 | 01 [3] | Main clause | 2 / 2 | 通过 |
| 04 | 02 [1] | Main clause | 1 / 1 | 通过 |
| 05 | 02 [2] | Main clause | 1 / 1 | 通过 |
| 06 | 02 [3] | Main clause, Relative clause | 2 / 3 | 通过 |
| 07 | 02 [4] | Main clause | 1 / 2 | 通过 |
| 08 | 02 [5] | Main clause | 1 / 1 | 通过 |
| 09 | 02 [6] | Main clause, Reason clause, Relative clause | 4 / 4 | 通过 |
| 10 | 02 [7] | Main clause | 1 / 1 | 通过 |
| 11 | 02 [8] | Main clause, Concessive clause, Relative clause | 3 / 6 | 通过 |
| 12 | 02 [9] | Main clause | 1 / 1 | 通过 |
| 13 | 02 [10] | Main clause, Object clause | 2 / 2 | 通过 |
| 14 | 02 [11] | Main clause, Relative clause | 2 / 2 | 通过 |
| 15 | 02 [12] | Main clause | 1 / 1 | 通过 |
| 16 | 02 [13] | Main clause, Object clause, Relative clause | 5 / 5 | 通过 |
| 17 | 03 [1] | Main clause, Time clause | 2 / 3 | 通过 |
| 18 | 03 [2] | Main clause | 1 / 1 | 通过 |
| 19 | 03 [3] | Main clause | 2 / 2 | 通过 |
| 20 | 03 [4] | Main clause, Object clause | 2 / 2 | 通过 |
| 21 | 03 [5] | Main clause, Time clause | 3 / 3 | 通过 |
| 22 | 03 [6] | Main clause, Relative clause | 2 / 4 | 通过 |
| 23 | 03 [7] | Main clause | 3 / 4 | 通过 |
| 24 | 03 [8] | Main clause | 2 / 2 | 通过 |
| 25 | 03 [9] | Main clause | 1 / 1 | 通过 |
| 26 | 04 [1] | Main clause | 1 / 2 | 通过 |
| 27 | 04 [2] | Main clause | 1 / 1 | 通过 |
| 28 | 04 [3] | Main clause | 1 / 1 | 通过 |
| 29 | 04 [4] | Main clause, Time clause | 2 / 2 | 通过 |
| 30 | 04 [5] | Main clause, Object clause, Relative clause, Comparative clause | 7 / 10 | 通过 |
| 31 | 04 [6] | Main clause | 2 / 4 | 通过 |
| 32 | 04 [7] | Main clause | 1 / 1 | 通过 |
| 33 | 04 [8] | Main clause | 1 / 1 | 通过 |
| 34 | 04 [9] | Main clause | 1 / 1 | 通过 |
| 35 | 04 [10] | Main clause, Time clause | 2 / 3 | 通过 |
| 36 | 04 [11] | Reporting clause, Quoted main clause | 2 / 1 | 通过 |
| 37 | 05 [1] | Sentence fragment | 1 / 0 | 通过 |
| 38 | 05 [2] | Main clause | 1 / 1 | 通过 |
| 39 | 05 [3] | Main clause, Subject clause, Appositive clause | 4 / 4 | 通过 |
| 40 | 05 [4] | Main clause | 1 / 1 | 通过 |
### Article 02

[详细语法核对说明](ARTICLE_02_STRUCTURE_AUDIT.md)

| 全文句号 | 段内位置 | 结构类型 | 结构框 / 谓语 | 结果 |
| --- | --- | --- | --- | --- |
| 01 | 01 [1] | Main clause, Object clause | 2 / 2 | 通过 |
| 02 | 02 [1] | Main clause | 1 / 1 | 通过 |
| 03 | 02 [2] | Main clause, Relative clause | 2 / 2 | 通过 |
| 04 | 02 [3] | Main clause, Conditional clause, Object clause | 3 / 3 | 通过 |
| 05 | 02 [4] | Main clause | 1 / 2 | 通过 |
| 06 | 03 [1] | Main clause, Relative clause | 2 / 3 | 通过 |
| 07 | 03 [2] | Main clause | 1 / 1 | 通过 |
| 08 | 03 [3] | Main clause, Relative clause | 3 / 3 | 通过 |
| 09 | 03 [4] | Main clause | 1 / 1 | 通过 |
| 10 | 03 [5] | Main clause | 1 / 1 | 通过 |
| 11 | 03 [6] | Main clause | 1 / 1 | 通过 |
| 12 | 03 [7] | Main clause | 2 / 2 | 通过 |
| 13 | 03 [8] | Main clause, Relative clause | 2 / 3 | 通过 |
| 14 | 03 [9] | Main clause | 1 / 1 | 通过 |
| 15 | 03 [10] | Main clause | 1 / 1 | 通过 |
| 16 | 03 [11] | Main clause | 1 / 1 | 通过 |
| 17 | 04 [1] | Main clause, Concessive clause | 2 / 2 | 通过 |
| 18 | 04 [2] | Main clause, Reason clause | 2 / 3 | 通过 |
| 19 | 04 [3] | Main clause | 2 / 3 | 通过 |
| 20 | 05 [1] | Main clause | 1 / 1 | 通过 |
| 21 | 05 [2] | Main clause, Time clause | 2 / 2 | 通过 |
| 22 | 05 [3] | Main clause, Time clause | 3 / 3 | 通过 |
| 23 | 06 [1] | Main clause | 1 / 2 | 通过 |
| 24 | 06 [2] | Main clause | 1 / 1 | 通过 |
| 25 | 06 [3] | Main clause, Comparative clause | 2 / 3 | 通过 |
| 26 | 06 [4] | Main clause, Predicative clause | 2 / 3 | 通过 |
| 27 | 07 [1] | Main clause, Parenthetical comment | 2 / 3 | 通过 |
| 28 | 07 [2] | Main clause, Reason clause | 2 / 3 | 通过 |
| 29 | 08 [1] | Main clause, Relative clause | 2 / 2 | 通过 |
| 30 | 08 [2] | Main clause, Time clause | 3 / 3 | 通过 |
| 31 | 08 [3] | Main clause, Subject clause, Predicative clause, Relative clause | 4 / 4 | 通过 |
| 32 | 08 [4] | Main clause | 1 / 1 | 通过 |
| 33 | 08 [5] | Main clause | 1 / 1 | 通过 |
| 34 | 08 [6] | Main clause | 1 / 1 | 通过 |
| 35 | 08 [7] | Main clause | 1 / 1 | 通过 |
| 36 | 08 [8] | Main clause, Relative clause | 2 / 2 | 通过 |
| 37 | 08 [9] | Main clause | 1 / 1 | 通过 |
| 38 | 09 [1] | Main clause, Relative clause, Object clause | 3 / 3 | 通过 |
| 39 | 09 [2] | Main clause, Relative clause | 3 / 3 | 通过 |
| 40 | 09 [3] | Main clause | 1 / 1 | 通过 |
| 41 | 09 [4] | Main clause | 1 / 1 | 通过 |
| 42 | 09 [5] | Main clause, Relative clause | 2 / 3 | 通过 |
| 43 | 09 [6] | Main clause, Cleft clause | 2 / 2 | 通过 |
| 44 | 09 [7] | Main clause | 1 / 1 | 通过 |
| 45 | 09 [8] | Main clause, Relative clause | 2 / 2 | 通过 |
| 46 | 10 [1] | Main clause, Object clause | 2 / 3 | 通过 |
| 47 | 10 [2] | Main clause, Time clause | 4 / 4 | 通过 |
| 48 | 10 [3] | Main clause | 2 / 2 | 通过 |
### Article 03

[详细语法核对说明](ARTICLE_03_STRUCTURE_AUDIT.md)

| 全文句号 | 段内位置 | 结构类型 | 结构框 / 谓语 | 结果 |
| --- | --- | --- | --- | --- |
| 01 | 01 [1] | Main clause | 1 / 1 | 通过 |
| 02 | 01 [2] | Main clause | 1 / 1 | 通过 |
| 03 | 01 [3] | Main clause | 1 / 2 | 通过 |
| 04 | 01 [4] | Main clause, Time clause | 3 / 4 | 通过 |
| 05 | 01 [5] | Main clause | 2 / 2 | 通过 |
| 06 | 01 [6] | Main clause | 2 / 2 | 通过 |
| 07 | 02 [1] | Main clause | 2 / 2 | 通过 |
| 08 | 02 [2] | Main clause, Relative clause | 2 / 3 | 通过 |
| 09 | 02 [3] | Main clause | 1 / 1 | 通过 |
| 10 | 02 [4] | Main clause | 1 / 1 | 通过 |
| 11 | 03 [1] | Main clause, Time clause | 3 / 3 | 通过 |
| 12 | 03 [2] | Main clause | 1 / 1 | 通过 |
| 13 | 03 [3] | Main clause | 1 / 3 | 通过 |
| 14 | 03 [4] | Main clause, Time clause | 2 / 2 | 通过 |
| 15 | 04 [1] | Main clause | 1 / 1 | 通过 |
| 16 | 04 [2] | Main clause | 1 / 1 | 通过 |
| 17 | 04 [3] | Main clause, Relative clause | 2 / 2 | 通过 |
| 18 | 04 [4] | Main clause, Reduced concessive clause | 2 / 1 | 通过 |
| 19 | 04 [5] | Main clause | 1 / 1 | 通过 |
| 20 | 04 [6] | Main clause, Time clause | 2 / 2 | 通过 |
| 21 | 04 [7] | Main clause | 1 / 1 | 通过 |
| 22 | 04 [8] | Main clause | 1 / 1 | 通过 |
| 23 | 04 [9] | Main clause | 1 / 1 | 通过 |
| 24 | 04 [10] | Main clause | 1 / 1 | 通过 |
| 25 | 04 [11] | Main clause, Time clause | 2 / 2 | 通过 |
| 26 | 04 [12] | Main clause, Relative clause | 2 / 2 | 通过 |
| 27 | 04 [13] | Main clause, Relative clause | 2 / 3 | 通过 |
| 28 | 04 [14] | Main clause | 1 / 1 | 通过 |
| 29 | 05 [1] | Main clause, Time clause | 2 / 2 | 通过 |
| 30 | 05 [2] | Main clause | 2 / 2 | 通过 |
| 31 | 05 [3] | Main clause, Relative clause | 3 / 3 | 通过 |
| 32 | 05 [4] | Main clause, Subject clause | 2 / 2 | 通过 |
| 33 | 06 [1] | Main clause | 1 / 1 | 通过 |
| 34 | 06 [2] | Main clause | 1 / 3 | 通过 |
| 35 | 06 [3] | Main clause | 2 / 2 | 通过 |
| 36 | 06 [4] | Main clause | 1 / 1 | 通过 |
| 37 | 06 [5] | Main clause | 1 / 1 | 通过 |
| 38 | 07 [1] | Main clause, Predicative clause | 2 / 2 | 通过 |
| 39 | 07 [2] | Main clause | 1 / 1 | 通过 |
| 40 | 07 [3] | Main clause | 1 / 1 | 通过 |
| 41 | 07 [4] | Main clause | 2 / 2 | 通过 |
| 42 | 07 [5] | Main clause, Object clause | 2 / 3 | 通过 |
| 43 | 07 [6] | Main clause, Object clause | 2 / 3 | 通过 |
| 44 | 08 [1] | Main clause | 1 / 2 | 通过 |
| 45 | 08 [2] | Main clause | 1 / 4 | 通过 |
| 46 | 08 [3] | Main clause, Reduced concessive clause | 2 / 1 | 通过 |
| 47 | 08 [4] | Main clause | 1 / 1 | 通过 |
| 48 | 09 [1] | Main clause, Reason clause | 2 / 2 | 通过 |
| 49 | 09 [2] | Main clause, Subject clause, Relative clause | 3 / 3 | 通过 |
| 50 | 09 [3] | Main clause, Time clause | 2 / 2 | 通过 |
| 51 | 09 [4] | Main clause | 1 / 1 | 通过 |
| 52 | 09 [5] | Main clause | 1 / 1 | 通过 |
| 53 | 09 [6] | Main clause, Comparative clause | 2 / 3 | 通过 |
| 54 | 09 [7] | Main clause | 2 / 2 | 通过 |
| 55 | 09 [8] | Main clause, Relative clause | 3 / 3 | 通过 |
| 56 | 10 [1] | Main clause | 1 / 1 | 通过 |
| 57 | 10 [2] | Main clause, Object clause | 2 / 4 | 通过 |
| 58 | 10 [3] | Main clause, Parenthetical comment | 3 / 2 | 通过 |
| 59 | 10 [4] | Main clause, Concessive clause | 2 / 2 | 通过 |
| 60 | 10 [5] | Main clause | 5 / 5 | 通过 |
| 61 | 10 [6] | Main clause | 2 / 2 | 通过 |
| 62 | 10 [7] | Main clause, Object clause | 2 / 3 | 通过 |
| 63 | 11 [1] | Main clause | 2 / 2 | 通过 |
| 64 | 11 [2] | Main clause | 2 / 2 | 通过 |
| 65 | 11 [3] | Main clause, Conditional clause | 3 / 3 | 通过 |
| 66 | 11 [4] | Main clause | 1 / 1 | 通过 |
### Article 04

[详细语法核对说明](ARTICLE_04_STRUCTURE_AUDIT.md)

| 全文句号 | 段内位置 | 结构类型 | 结构框 / 谓语 | 结果 |
| --- | --- | --- | --- | --- |
| 01 | 01 [1] | Main clause | 2 / 2 | 通过 |
| 02 | 01 [2] | Main clause | 1 / 1 | 通过 |
| 03 | 01 [3] | Main clause, Time clause | 2 / 2 | 通过 |
| 04 | 01 [4] | Main clause, Absolute construction, Time clause | 3 / 2 | 通过 |
| 05 | 01 [5] | Main clause | 1 / 2 | 通过 |
| 06 | 02 [1] | Main clause | 1 / 1 | 通过 |
| 07 | 02 [2] | Main clause, Time clause | 3 / 3 | 通过 |
| 08 | 02 [3] | Main clause, Relative clause | 2 / 2 | 通过 |
| 09 | 02 [4] | Main clause | 1 / 1 | 通过 |
| 10 | 02 [5] | Main clause | 1 / 2 | 通过 |
| 11 | 03 [1] | Main clause | 1 / 1 | 通过 |
| 12 | 03 [2] | Main clause, Concessive clause, Relative clause | 3 / 3 | 通过 |
| 13 | 04 [1] | Main clause, Reason clause, Relative clause | 3 / 3 | 通过 |
| 14 | 04 [2] | Main clause, Object clause | 3 / 3 | 通过 |
| 15 | 05 [1] | Quoted main clause, Reporting clause | 2 / 3 | 通过 |
| 16 | 05 [2] | Main clause | 1 / 1 | 通过 |
| 17 | 05 [3] | Main clause | 2 / 2 | 通过 |
| 18 | 05 [4] | Main clause | 2 / 2 | 通过 |
| 19 | 05 [5] | Main clause, Concessive clause, Object clause | 4 / 5 | 通过 |
| 20 | 05 [6] | Main clause | 1 / 1 | 通过 |
| 21 | 05 [7] | Main clause | 1 / 1 | 通过 |
| 22 | 05 [8] | Main clause | 2 / 2 | 通过 |
| 23 | 05 [9] | Main clause, Object clause | 2 / 2 | 通过 |
| 24 | 06 [1] | Main clause | 1 / 1 | 通过 |
| 25 | 06 [2] | Main clause, Reduced concessive clause | 2 / 1 | 通过 |
| 26 | 06 [3] | Main clause, Concessive clause | 2 / 3 | 通过 |
| 27 | 06 [4] | Main clause, Elliptical main clause | 2 / 1 | 通过 |
| 28 | 06 [5] | Main clause | 2 / 2 | 通过 |
| 29 | 06 [6] | Main clause | 1 / 1 | 通过 |
| 30 | 06 [7] | Main clause, Result clause | 2 / 3 | 通过 |
| 31 | 06 [8] | Main clause | 1 / 1 | 通过 |
| 32 | 06 [9] | Main clause | 1 / 1 | 通过 |
| 33 | 07 [1] | Main clause, Object clause | 2 / 2 | 通过 |
| 34 | 07 [2] | Main clause | 1 / 2 | 通过 |
| 35 | 07 [3] | Main clause, Relative clause | 2 / 2 | 通过 |
| 36 | 07 [4] | Main clause, Reason clause | 3 / 3 | 通过 |
| 37 | 07 [5] | Main clause | 1 / 2 | 通过 |
| 38 | 07 [6] | Main clause, Parenthetical comment, Object clause | 4 / 6 | 通过 |
| 39 | 07 [7] | Main clause, Content clause | 2 / 2 | 通过 |
| 40 | 07 [8] | Main clause | 3 / 3 | 通过 |
| 41 | 07 [9] | Main clause | 1 / 2 | 通过 |
| 42 | 07 [10] | Sentence fragment | 1 / 0 | 通过 |
| 43 | 07 [11] | Main clause | 1 / 1 | 通过 |
| 44 | 08 [1] | Main clause | 2 / 2 | 通过 |
| 45 | 08 [2] | Main clause | 1 / 1 | 通过 |
| 46 | 08 [3] | Main clause | 2 / 2 | 通过 |
| 47 | 08 [4] | Main clause | 2 / 3 | 通过 |
| 48 | 08 [5] | Main clause, Time clause | 3 / 3 | 通过 |
| 49 | 09 [1] | Quoted main clause, Reporting clause | 2 / 2 | 通过 |
| 50 | 09 [2] | Main clause | 1 / 2 | 通过 |
| 51 | 09 [3] | Main clause | 1 / 2 | 通过 |
| 52 | 09 [4] | Main clause | 1 / 1 | 通过 |
| 53 | 10 [1] | Main clause, Comparative clause | 2 / 2 | 通过 |
| 54 | 11 [1] | Quoted main clause, Reporting clause | 2 / 2 | 通过 |
| 55 | 11 [2] | Main clause | 1 / 2 | 通过 |
| 56 | 11 [3] | Main clause, Relative clause, Conditional clause | 4 / 4 | 通过 |
| 57 | 11 [4] | Main clause, Concessive clause, Object clause | 3 / 3 | 通过 |
| 58 | 11 [5] | Main clause | 2 / 3 | 通过 |
| 59 | 11 [6] | Main clause | 1 / 1 | 通过 |
| 60 | 11 [7] | Main clause, Predicative clause | 3 / 3 | 通过 |
| 61 | 11 [8] | Main clause | 2 / 2 | 通过 |
| 62 | 11 [9] | Main clause | 1 / 1 | 通过 |
| 63 | 12 [1] | Main clause | 1 / 1 | 通过 |
| 64 | 12 [2] | Main clause, Time clause | 2 / 3 | 通过 |
| 65 | 12 [3] | Main clause | 1 / 2 | 通过 |
| 66 | 12 [4] | Main clause, Reduced conditional clause | 2 / 1 | 通过 |
| 67 | 12 [5] | Main clause | 1 / 2 | 通过 |
| 68 | 12 [6] | Main clause | 2 / 3 | 通过 |
| 69 | 12 [7] | Main clause | 1 / 2 | 通过 |
| 70 | 12 [8] | Main clause | 1 / 2 | 通过 |
| 71 | 12 [9] | Main clause | 1 / 1 | 通过 |
| 72 | 12 [10] | Main clause | 1 / 1 | 通过 |
| 73 | 12 [11] | Main clause | 1 / 1 | 通过 |
| 74 | 13 [1] | Main clause, Relative clause | 2 / 2 | 通过 |
| 75 | 13 [2] | Main clause | 1 / 1 | 通过 |
### Article 05

[详细语法核对说明](ARTICLE_05_STRUCTURE_AUDIT.md)

| 全文句号 | 段内位置 | 结构类型 | 结构框 / 谓语 | 结果 |
| --- | --- | --- | --- | --- |
| 01 | 01 [1] | Main clause | 1 / 1 | 通过 |
| 02 | 01 [2] | Main clause | 1 / 1 | 通过 |
| 03 | 01 [3] | Main clause, Conditional clause | 3 / 6 | 通过 |
| 04 | 02 [1] | Main clause | 1 / 1 | 通过 |
| 05 | 02 [2] | Main clause, Time clause | 3 / 3 | 通过 |
| 06 | 02 [3] | Main clause | 1 / 1 | 通过 |
| 07 | 02 [4] | Main clause | 1 / 1 | 通过 |
| 08 | 02 [5] | Main clause | 1 / 1 | 通过 |
| 09 | 03 [1] | Main clause | 2 / 2 | 通过 |
| 10 | 03 [2] | Main clause | 1 / 1 | 通过 |
| 11 | 03 [3] | Main clause | 2 / 2 | 通过 |
| 12 | 04 [1] | Main clause | 1 / 1 | 通过 |
| 13 | 04 [2] | Main clause, Time clause | 2 / 2 | 通过 |
| 14 | 05 [1] | Sentence fragment | 1 / 0 | 通过 |
| 15 | 05 [2] | Quoted fragment, Reporting clause | 2 / 1 | 通过 |
| 16 | 06 [1] | Main clause | 1 / 1 | 通过 |
| 17 | 06 [2] | Main clause | 1 / 1 | 通过 |
| 18 | 07 [1] | Quoted main clause, Object clause, Reporting clause | 3 / 3 | 通过 |
| 19 | 08 [1] | Main clause | 1 / 1 | 通过 |
| 20 | 08 [2] | Main clause | 1 / 1 | 通过 |
| 21 | 08 [3] | Main clause, Time clause, Absolute construction | 5 / 2 | 通过 |
| 22 | 08 [4] | Main clause | 1 / 1 | 通过 |
| 23 | 09 [1] | Vocative fragment, Reporting clause, Quoted main clause | 4 / 3 | 通过 |
| 24 | 10 [1] | Main clause | 1 / 1 | 通过 |
| 25 | 10 [2] | Main clause | 1 / 2 | 通过 |
| 26 | 11 [1] | Main clause | 1 / 1 | 通过 |
| 27 | 11 [2] | Main clause | 1 / 1 | 通过 |
| 28 | 12 [1] | Main clause | 1 / 2 | 通过 |
| 29 | 12 [2] | Main clause | 1 / 1 | 通过 |
| 30 | 13 [1] | Main clause | 1 / 1 | 通过 |
| 31 | 13 [2] | Main clause | 2 / 2 | 通过 |
| 32 | 13 [3] | Main clause | 1 / 1 | 通过 |
| 33 | 14 [1] | Quoted fragment, Reporting clause | 2 / 1 | 通过 |
| 34 | 14 [2] | Main clause, Parenthetical comment | 2 / 2 | 通过 |
| 35 | 14 [3] | Main clause | 1 / 1 | 通过 |
| 36 | 15 [1] | Main clause | 1 / 1 | 通过 |
| 37 | 15 [2] | Main clause | 1 / 1 | 通过 |
| 38 | 15 [3] | Main clause, Object clause, Relative clause | 3 / 3 | 通过 |
| 39 | 15 [4] | Main clause, Predicative clause | 2 / 2 | 通过 |
| 40 | 16 [1] | Main clause, Predicative clause | 2 / 2 | 通过 |
| 41 | 16 [2] | Main clause, Concessive clause | 2 / 3 | 通过 |
| 42 | 17 [1] | Main clause | 1 / 1 | 通过 |
| 43 | 18 [1] | Main clause | 1 / 1 | 通过 |
| 44 | 18 [2] | Main clause | 1 / 1 | 通过 |
| 45 | 19 [1] | Main clause | 1 / 1 | 通过 |
| 46 | 20 [1] | Main clause | 1 / 2 | 通过 |
| 47 | 21 [1] | Main clause | 1 / 1 | 通过 |
| 48 | 21 [2] | Main clause | 1 / 1 | 通过 |
| 49 | 21 [3] | Main clause, Reason clause | 2 / 2 | 通过 |
| 50 | 21 [4] | Main clause | 1 / 1 | 通过 |
| 51 | 21 [5] | Main clause, Conditional clause | 2 / 2 | 通过 |
| 52 | 21 [6] | Main clause | 1 / 1 | 通过 |
| 53 | 21 [7] | Main clause | 1 / 1 | 通过 |
| 54 | 22 [1] | Main clause | 1 / 1 | 通过 |
| 55 | 22 [2] | Main clause | 1 / 1 | 通过 |
| 56 | 22 [3] | Main clause, Object clause | 2 / 2 | 通过 |
| 57 | 22 [4] | Sentence fragment | 1 / 0 | 通过 |
| 58 | 22 [5] | Main clause | 1 / 1 | 通过 |
| 59 | 22 [6] | Main clause | 1 / 1 | 通过 |
| 60 | 22 [7] | Main clause, Conditional clause | 2 / 2 | 通过 |
| 61 | 22 [8] | Sentence fragment | 1 / 0 | 通过 |
| 62 | 23 [1] | Main clause | 1 / 2 | 通过 |
| 63 | 23 [2] | Sentence fragment | 1 / 0 | 通过 |
| 64 | 24 [1] | Sentence fragment | 1 / 0 | 通过 |
| 65 | 24 [2] | Main clause | 1 / 2 | 通过 |
| 66 | 24 [3] | Main clause | 1 / 1 | 通过 |
| 67 | 25 [1] | Main clause | 1 / 1 | 通过 |
| 68 | 25 [2] | Main clause | 1 / 1 | 通过 |
| 69 | 26 [1] | Main clause | 1 / 2 | 通过 |
| 70 | 26 [2] | Main clause | 1 / 1 | 通过 |
| 71 | 26 [3] | Main clause, Object clause | 2 / 3 | 通过 |
| 72 | 27 [1] | Main clause | 1 / 1 | 通过 |
| 73 | 28 [1] | Main clause | 1 / 1 | 通过 |
| 74 | 28 [2] | Main clause | 1 / 1 | 通过 |
| 75 | 28 [3] | Main clause | 1 / 1 | 通过 |
| 76 | 28 [4] | Main clause | 1 / 1 | 通过 |
| 77 | 29 [1] | Main clause | 1 / 2 | 通过 |
| 78 | 30 [1] | Sentence fragment | 1 / 0 | 通过 |
| 79 | 31 [1] | Sentence fragment | 1 / 0 | 通过 |
| 80 | 32 [1] | Main clause | 1 / 1 | 通过 |
### Article 06

[详细语法核对说明](ARTICLE_06_STRUCTURE_AUDIT.md)

| 全文句号 | 段内位置 | 结构类型 | 结构框 / 谓语 | 结果 |
| --- | --- | --- | --- | --- |
| 01 | 01 [1] | Main clause, Relative clause | 3 / 4 | 通过 |
| 02 | 01 [2] | Main clause | 1 / 1 | 通过 |
| 03 | 01 [3] | Main clause | 2 / 2 | 通过 |
| 04 | 01 [4] | Main clause, Relative clause, Elliptical main clause, Object clause, Reason clause, Subject clause | 7 / 11 | 通过 |
| 05 | 01 [5] | Main clause, Relative clause | 3 / 3 | 通过 |
| 06 | 01 [6] | Main clause, Relative clause | 3 / 3 | 通过 |
| 07 | 01 [7] | Main clause, Concessive clause | 2 / 2 | 通过 |
| 08 | 01 [8] | Main clause | 1 / 1 | 通过 |
| 09 | 01 [9] | Main clause | 1 / 2 | 通过 |
| 10 | 01 [10] | Main clause | 1 / 1 | 通过 |
| 11 | 01 [11] | Main clause, Time clause | 2 / 4 | 通过 |
| 12 | 01 [12] | Main clause, Time clause | 3 / 3 | 通过 |
| 13 | 01 [13] | Main clause | 1 / 2 | 通过 |
| 14 | 01 [14] | Main clause | 1 / 1 | 通过 |
| 15 | 01 [15] | Main clause, Relative clause | 2 / 2 | 通过 |
| 16 | 01 [16] | Main clause, Time clause, Purpose clause | 3 / 4 | 通过 |
| 17 | 02 [1] | Main clause, Relative clause | 4 / 6 | 通过 |
| 18 | 02 [2] | Main clause, Object clause | 3 / 5 | 通过 |
| 19 | 02 [3] | Main clause | 2 / 3 | 通过 |
| 20 | 02 [4] | Main clause, Time clause | 3 / 3 | 通过 |
| 21 | 02 [5] | Main clause, Absolute construction | 2 / 1 | 通过 |
| 22 | 02 [6] | Main clause, Object clause | 3 / 3 | 通过 |
| 23 | 02 [7] | Main clause, Reason clause, Object clause, Fused relative clause | 5 / 6 | 通过 |
| 24 | 03 [1] | Main clause, Relative clause | 2 / 2 | 通过 |
| 25 | 03 [2] | Main clause, Relative clause, Place clause | 5 / 6 | 通过 |
| 26 | 03 [3] | Main clause | 1 / 1 | 通过 |
| 27 | 03 [4] | Main clause, Parenthetical comment, Relative clause | 3 / 4 | 通过 |
| 28 | 04 [1] | Main clause | 1 / 2 | 通过 |
| 29 | 04 [2] | Main clause, Appositive clause | 3 / 3 | 通过 |
| 30 | 04 [3] | Main clause | 1 / 1 | 通过 |
| 31 | 04 [4] | Main clause, Parenthetical comment | 2 / 5 | 通过 |
| 32 | 04 [5] | Main clause, Reason clause, Relative clause | 3 / 6 | 通过 |
| 33 | 04 [6] | Main clause | 2 / 2 | 通过 |
| 34 | 04 [7] | Main clause, Time clause | 2 / 2 | 通过 |
| 35 | 04 [8] | Main clause, Object clause, Concessive clause, Relative clause | 5 / 6 | 通过 |
| 36 | 04 [9] | Main clause | 1 / 3 | 通过 |
| 37 | 05 [1] | Main clause | 1 / 1 | 通过 |
| 38 | 05 [2] | Main clause | 1 / 1 | 通过 |
| 39 | 05 [3] | Main clause | 1 / 2 | 通过 |
| 40 | 05 [4] | Main clause | 1 / 3 | 通过 |
| 41 | 05 [5] | Main clause, Reduced conditional clause | 2 / 2 | 通过 |
| 42 | 05 [6] | Main clause, Comparative clause, Relative clause | 3 / 6 | 通过 |
| 43 | 05 [7] | Main clause | 1 / 3 | 通过 |
| 44 | 05 [8] | Main clause, Object clause, Relative clause, Conditional clause, Reason clause | 6 / 7 | 通过 |
| 45 | 05 [9] | Main clause, Time clause | 2 / 5 | 通过 |
| 46 | 05 [10] | Main clause, Time clause | 2 / 3 | 通过 |
| 47 | 05 [11] | Main clause | 1 / 1 | 通过 |
| 48 | 05 [12] | Main clause, Object clause, Relative clause | 6 / 8 | 通过 |
| 49 | 05 [13] | Main clause, Time clause, Relative clause, Comparative clause, Concessive clause, Parenthetical comment | 9 / 10 | 通过 |
### Article 07

[详细语法核对说明](ARTICLE_07_STRUCTURE_AUDIT.md)

| 全文句号 | 段内位置 | 结构类型 | 结构框 / 谓语 | 结果 |
| --- | --- | --- | --- | --- |
| 01 | 01 [1] | Main clause | 1 / 1 | 通过 |
| 02 | 01 [2] | Main clause | 1 / 2 | 通过 |
| 03 | 01 [3] | Main clause, Relative clause | 2 / 2 | 通过 |
| 04 | 02 [1] | Main clause | 1 / 1 | 通过 |
| 05 | 02 [2] | Main clause | 1 / 1 | 通过 |
| 06 | 02 [3] | Main clause | 1 / 1 | 通过 |
| 07 | 03 [1] | Main clause | 1 / 1 | 通过 |
| 08 | 03 [2] | Main clause | 1 / 1 | 通过 |
| 09 | 03 [3] | Main clause | 1 / 1 | 通过 |
| 10 | 03 [4] | Main clause, Relative clause | 2 / 2 | 通过 |
| 11 | 03 [5] | Main clause | 1 / 2 | 通过 |
| 12 | 04 [1] | Main clause, Content clause | 2 / 2 | 通过 |
| 13 | 04 [2] | Main clause, Purpose clause | 2 / 2 | 通过 |
| 14 | 04 [3] | Main clause | 1 / 2 | 通过 |
| 15 | 04 [4] | Main clause, Time clause | 2 / 3 | 通过 |
| 16 | 04 [5] | Main clause | 1 / 1 | 通过 |
| 17 | 04 [6] | Main clause, Relative clause | 2 / 2 | 通过 |
| 18 | 05 [1] | Main clause | 1 / 1 | 通过 |
| 19 | 05 [2] | Main clause, Relative clause | 3 / 4 | 通过 |
| 20 | 05 [3] | Main clause | 1 / 2 | 通过 |
| 21 | 05 [4] | Main clause | 1 / 1 | 通过 |
| 22 | 05 [5] | Main clause | 1 / 1 | 通过 |
| 23 | 06 [1] | Main clause, Relative clause | 2 / 2 | 通过 |
| 24 | 06 [2] | Main clause, Relative clause | 2 / 2 | 通过 |
| 25 | 06 [3] | Main clause | 2 / 2 | 通过 |
| 26 | 06 [4] | Main clause | 3 / 3 | 通过 |
| 27 | 06 [5] | Main clause, Absolute construction | 3 / 2 | 通过 |
| 28 | 07 [1] | Main clause, Reason clause | 2 / 2 | 通过 |
| 29 | 07 [2] | Main clause | 1 / 1 | 通过 |
| 30 | 07 [3] | Main clause, Relative clause, Elliptical main clause | 4 / 2 | 通过 |
| 31 | 07 [4] | Main clause | 3 / 3 | 通过 |
| 32 | 07 [5] | Main clause | 1 / 1 | 通过 |
| 33 | 08 [1] | Main clause | 1 / 1 | 通过 |
| 34 | 08 [2] | Main clause, Relative clause | 2 / 2 | 通过 |
| 35 | 08 [3] | Main clause, Place clause | 2 / 2 | 通过 |
| 36 | 09 [1] | Main clause, Exclamative fragment | 2 / 1 | 通过 |
| 37 | 09 [2] | Main clause, Time clause, Absolute construction | 3 / 2 | 通过 |
| 38 | 09 [3] | Main clause | 1 / 1 | 通过 |
| 39 | 10 [1] | Main clause | 1 / 1 | 通过 |
| 40 | 10 [2] | Main clause, Object clause | 2 / 3 | 通过 |
| 41 | 10 [3] | Main clause, Object clause | 2 / 4 | 通过 |
| 42 | 11 [1] | Main clause, Relative clause, Reason clause, Parenthetical comment | 4 / 5 | 通过 |
| 43 | 11 [2] | Main clause, Reason clause | 2 / 2 | 通过 |
| 44 | 11 [3] | Main clause | 1 / 1 | 通过 |
| 45 | 11 [4] | Main clause | 1 / 1 | 通过 |
| 46 | 12 [1] | Main clause | 1 / 1 | 通过 |
| 47 | 12 [2] | Main clause, Time clause | 2 / 3 | 通过 |
| 48 | 12 [3] | Main clause, Conditional clause, Relative clause | 4 / 5 | 通过 |
### Article 08

[详细语法核对说明](ARTICLE_08_STRUCTURE_AUDIT.md)

| 全文句号 | 段内位置 | 结构类型 | 结构框 / 谓语 | 结果 |
| --- | --- | --- | --- | --- |
| 01 | 01 [1] | Main clause | 1 / 1 | 通过 |
| 02 | 01 [2] | Main clause, Predicative clause, Time clause | 3 / 3 | 通过 |
| 03 | 02 [1] | Main clause | 2 / 3 | 通过 |
| 04 | 02 [2] | Main clause, Reduced time clause, Relative clause | 3 / 3 | 通过 |
| 05 | 03 [1] | Main clause | 1 / 1 | 通过 |
| 06 | 03 [2] | Main clause, Appositive clause, Fused relative clause | 3 / 3 | 通过 |
| 07 | 03 [3] | Sentence fragment | 1 / 0 | 通过 |
| 08 | 03 [4] | Main clause, Relative clause | 3 / 3 | 通过 |
| 09 | 03 [5] | Main clause, Time clause | 2 / 3 | 通过 |
| 10 | 03 [6] | Main clause, Time clause, Subject clause | 4 / 4 | 通过 |
| 11 | 04 [1] | Main clause, Predicative clause, Relative clause | 3 / 3 | 通过 |
| 12 | 04 [2] | Main clause | 1 / 2 | 通过 |
| 13 | 04 [3] | Main clause | 1 / 1 | 通过 |
| 14 | 04 [4] | Main clause, Conditional clause | 2 / 4 | 通过 |
| 15 | 04 [5] | Main clause | 1 / 1 | 通过 |
| 16 | 04 [6] | Main clause, Time clause | 3 / 3 | 通过 |
| 17 | 05 [1] | Main clause, Time clause, Object clause, Predicative clause | 5 / 6 | 通过 |
| 18 | 05 [2] | Main clause, Time clause | 2 / 2 | 通过 |
| 19 | 06 [1] | Main clause, Relative clause, Time clause | 3 / 3 | 通过 |
| 20 | 07 [1] | Main clause, Time clause | 2 / 3 | 通过 |
| 21 | 07 [2] | Main clause, Relative clause | 2 / 2 | 通过 |
| 22 | 07 [3] | Main clause, Concessive clause, Relative clause | 3 / 4 | 通过 |
| 23 | 08 [1] | Main clause, Concessive clause, Fused relative clause, Predicative clause | 4 / 5 | 通过 |
| 24 | 08 [2] | Main clause | 3 / 3 | 通过 |
| 25 | 08 [3] | Main clause | 1 / 1 | 通过 |
| 26 | 08 [4] | Main clause | 2 / 2 | 通过 |
| 27 | 09 [1] | Main clause | 1 / 1 | 通过 |
| 28 | 09 [2] | Main clause, Reduced concessive clause | 2 / 1 | 通过 |
| 29 | 09 [3] | Main clause, Object clause | 2 / 2 | 通过 |
| 30 | 09 [4] | Main clause, Quoted main clause | 2 / 2 | 通过 |
| 31 | 10 [1] | Main clause | 1 / 1 | 通过 |
| 32 | 10 [2] | Main clause | 2 / 2 | 通过 |
| 33 | 10 [3] | Main clause | 1 / 1 | 通过 |
| 34 | 10 [4] | Main clause, Elliptical main clause, Conditional clause, Object clause | 4 / 4 | 通过 |
| 35 | 10 [5] | Elliptical main clause, Conditional clause, Relative clause | 3 / 2 | 通过 |
| 36 | 10 [6] | Main clause | 1 / 2 | 通过 |
| 37 | 10 [7] | Main clause | 1 / 1 | 通过 |
| 38 | 10 [8] | Main clause | 1 / 1 | 通过 |
| 39 | 11 [1] | Main clause, Time clause, Relative clause | 3 / 3 | 通过 |
| 40 | 11 [2] | Main clause, Relative clause | 2 / 3 | 通过 |
| 41 | 11 [3] | Main clause, Relative clause | 3 / 4 | 通过 |
| 42 | 12 [1] | Main clause, Object clause, Relative clause | 3 / 4 | 通过 |
| 43 | 12 [2] | Main clause, Object clause | 2 / 3 | 通过 |
| 44 | 13 [1] | Main clause | 1 / 1 | 通过 |
| 45 | 13 [2] | Main clause, Relative clause | 3 / 3 | 通过 |
| 46 | 13 [3] | Main clause, Relative clause | 2 / 2 | 通过 |
| 47 | 13 [4] | Main clause, Relative clause | 2 / 2 | 通过 |
| 48 | 13 [5] | Main clause, Fused relative clause | 2 / 2 | 通过 |
| 49 | 14 [1] | Main clause, Relative clause, Predicative clause | 3 / 4 | 通过 |
| 50 | 14 [2] | Main clause | 1 / 1 | 通过 |
| 51 | 14 [3] | Main clause | 1 / 2 | 通过 |
| 52 | 14 [4] | Main clause, Relative clause | 2 / 3 | 通过 |
| 53 | 15 [1] | Main clause, Predicative clause | 2 / 2 | 通过 |
| 54 | 15 [2] | Main clause, Relative clause | 3 / 4 | 通过 |
| 55 | 15 [3] | Main clause, Relative clause | 2 / 2 | 通过 |
| 56 | 15 [4] | Main clause | 1 / 1 | 通过 |
| 57 | 15 [5] | Main clause | 1 / 2 | 通过 |
| 58 | 15 [6] | Main clause | 1 / 1 | 通过 |
| 59 | 16 [1] | Main clause, Relative clause | 2 / 4 | 通过 |
| 60 | 17 [1] | Main clause, Object clause | 3 / 3 | 通过 |
| 61 | 18 [1] | Main clause, Conditional clause | 2 / 4 | 通过 |
| 62 | 18 [2] | Main clause | 2 / 2 | 通过 |
| 63 | 19 [1] | Main clause, Object clause, Relative clause | 3 / 3 | 通过 |
| 64 | 20 [1] | Main clause | 1 / 1 | 通过 |
| 65 | 20 [2] | Main clause, Relative clause | 3 / 3 | 通过 |
### Article 09

[详细语法核对说明](ARTICLE_09_STRUCTURE_AUDIT.md)

| 全文句号 | 段内位置 | 结构类型 | 结构框 / 谓语 | 结果 |
| --- | --- | --- | --- | --- |
| 01 | 01 [1] | Main clause, Relative clause | 2 / 2 | 通过 |
| 02 | 01 [2] | Main clause, Relative clause | 2 / 2 | 通过 |
| 03 | 01 [3] | Main clause | 1 / 1 | 通过 |
| 04 | 02 [1] | Main clause, Conditional clause, Quoted imperative | 3 / 3 | 通过 |
| 05 | 02 [2] | Main clause | 1 / 2 | 通过 |
| 06 | 03 [1] | Main clause | 2 / 2 | 通过 |
| 07 | 03 [2] | Main clause, Relative clause | 2 / 2 | 通过 |
| 08 | 03 [3] | Main clause | 1 / 1 | 通过 |
| 09 | 03 [4] | Main clause | 2 / 2 | 通过 |
| 10 | 04 [1] | Main clause | 1 / 1 | 通过 |
| 11 | 04 [2] | Main clause | 1 / 1 | 通过 |
| 12 | 04 [3] | Elliptical continuation, Relative clause, Time clause | 3 / 2 | 通过 |
| 13 | 04 [4] | Main clause | 1 / 1 | 通过 |
| 14 | 04 [5] | Main clause | 1 / 2 | 通过 |
| 15 | 04 [6] | Main clause | 1 / 1 | 通过 |
| 16 | 04 [7] | Main clause | 1 / 1 | 通过 |
| 17 | 05 [1] | Imperative clause, Main clause | 2 / 2 | 通过 |
| 18 | 05 [2] | Main clause | 1 / 1 | 通过 |
| 19 | 05 [3] | Main clause | 1 / 1 | 通过 |
| 20 | 05 [4] | Main clause | 1 / 1 | 通过 |
| 21 | 05 [5] | Main clause | 1 / 2 | 通过 |
| 22 | 05 [6] | Main clause | 1 / 1 | 通过 |
| 23 | 05 [7] | Main clause, Time clause | 2 / 2 | 通过 |
| 24 | 06 [1] | Main clause | 1 / 2 | 通过 |
| 25 | 06 [2] | Main clause, Relative clause | 2 / 3 | 通过 |
| 26 | 06 [3] | Main clause, Time clause | 2 / 3 | 通过 |
| 27 | 06 [4] | Main clause | 1 / 1 | 通过 |
| 28 | 07 [1] | Main clause, Object clause | 2 / 3 | 通过 |
| 29 | 07 [2] | Main clause | 2 / 2 | 通过 |
| 30 | 07 [3] | Main clause | 1 / 1 | 通过 |
| 31 | 07 [4] | Main clause, Relative clause | 3 / 5 | 通过 |
| 32 | 08 [1] | Main clause | 1 / 1 | 通过 |
| 33 | 08 [2] | Main clause | 1 / 1 | 通过 |
| 34 | 08 [3] | Main clause, Time clause | 2 / 2 | 通过 |
| 35 | 08 [4] | Main clause, Time clause, Reason clause, Object clause | 4 / 4 | 通过 |
| 36 | 08 [5] | Main clause | 1 / 1 | 通过 |
| 37 | 08 [6] | Main clause, Imperative clause | 2 / 2 | 通过 |
| 38 | 09 [1] | Main clause, Purpose clause | 2 / 2 | 通过 |
| 39 | 09 [2] | Main clause, Relative clause | 2 / 2 | 通过 |
| 40 | 09 [3] | Main clause | 1 / 1 | 通过 |
| 41 | 09 [4] | Main clause, Predicative clause, Appositive clause | 4 / 4 | 通过 |
| 42 | 09 [5] | Main clause, Relative clause | 2 / 2 | 通过 |
| 43 | 09 [6] | Main clause | 1 / 1 | 通过 |
| 44 | 10 [1] | Main clause, Reason clause, Relative clause, Parenthetical comment | 4 / 4 | 通过 |
| 45 | 10 [2] | Main clause | 1 / 1 | 通过 |
| 46 | 10 [3] | Main clause | 1 / 1 | 通过 |
| 47 | 10 [4] | Main clause | 1 / 1 | 通过 |
| 48 | 10 [5] | Main clause, Time clause, Elliptical main clause, Relative clause | 5 / 4 | 通过 |
| 49 | 10 [6] | Main clause, Object clause | 2 / 3 | 通过 |
| 50 | 10 [7] | Main clause | 1 / 1 | 通过 |
### Article 10

[详细语法核对说明](ARTICLE_10_STRUCTURE_AUDIT.md)

| 全文句号 | 段内位置 | 结构类型 | 结构框 / 谓语 | 结果 |
| --- | --- | --- | --- | --- |
| 01 | 01 [1] | Main clause, Relative clause, Manner clause | 4 / 4 | 通过 |
| 02 | 01 [2] | Main clause | 2 / 2 | 通过 |
| 03 | 01 [3] | Main clause, Relative clause, Object clause | 7 / 5 | 通过 |
| 04 | 01 [4] | Main clause, Relative clause | 3 / 2 | 通过 |
| 05 | 01 [5] | Main clause, Relative clause, Object clause | 10 / 12 | 通过 |
| 06 | 01 [6] | Main clause, Relative clause | 2 / 2 | 通过 |
| 07 | 01 [7] | Main clause, Relative clause, Contrast clause | 3 / 4 | 通过 |
| 08 | 02 [1] | Main clause, Time clause, Relative clause, Comparative clause | 4 / 5 | 通过 |
| 09 | 02 [2] | Main clause | 1 / 1 | 通过 |
| 10 | 02 [3] | Main clause, Relative clause, Time clause | 3 / 4 | 通过 |
| 11 | 02 [4] | Main clause | 1 / 1 | 通过 |
| 12 | 02 [5] | Main clause, Relative clause, Time clause | 3 / 3 | 通过 |
| 13 | 02 [6] | Main clause, Relative clause, Place clause | 16 / 16 | 通过 |
| 14 | 02 [7] | Main clause | 2 / 2 | 通过 |
| 15 | 03 [1] | Main clause | 1 / 1 | 通过 |
| 16 | 03 [2] | Main clause | 1 / 2 | 通过 |
| 17 | 03 [3] | Main clause | 2 / 3 | 通过 |
| 18 | 03 [4] | Main clause, Parenthetical comment, Relative clause | 6 / 6 | 通过 |
| 19 | 03 [5] | Main clause, Conditional clause, Object clause, Relative clause, Appositive clause | 17 / 20 | 通过 |
| 20 | 04 [1] | Main clause | 1 / 1 | 通过 |
| 21 | 04 [2] | Main clause, Relative clause | 3 / 3 | 通过 |
| 22 | 04 [3] | Main clause | 1 / 1 | 通过 |
| 23 | 04 [4] | Main clause, Relative clause | 2 / 3 | 通过 |
| 24 | 04 [5] | Main clause, Fused relative clause | 2 / 3 | 通过 |
| 25 | 04 [6] | Main clause | 2 / 5 | 通过 |
| 26 | 04 [7] | Main clause, Object clause | 2 / 4 | 通过 |

## 实际生词跳转抽查记录

| 文章 | 全文句号 | 词组 |
| --- | --- | --- |
| 01 | 02 | proportion |
| 01 | 02 | illustrates |
| 01 | 04 | hit on |
| 01 | 05 | specialized |
| 01 | 06 | concentrated on |
| 01 | 09 | neglected |
| 01 | 03 | drive |
| 01 | 09 | positive knowledge |
| 01 | 16 | references |
| 01 | 29 | essential |
| 01 | 39 | crying out |
| 02 | 01 | going viral |
| 02 | 02 | gaining ground |
| 02 | 03 | submitted |
| 02 | 03 | states |
| 02 | 04 | recommends |
| 02 | 05 | establishment |
| 02 | 11 | cottages |
| 02 | 21 | muscle power |
| 02 | 32 | there is a cost to making |
| 02 | 48 | compassion |
| 03 | 01 | came rather late to |
| 03 | 03 | remained |
| 03 | 04 | mow |
| 03 | 04 | insisted on |
| 03 | 05 | wrestled |
| 03 | 14 | emissary |
| 03 | 25 | escaped through |
| 03 | 35 | Ann Arbor |
| 03 | 50 | solid |
| 03 | 66 | come along |
| 04 | 01 | Rush hour |
| 04 | 03 | checked |
| 04 | 04 | packed |
| 04 | 05 | may well |
| 04 | 19 | ought to |
| 04 | 22 | frowning |
| 04 | 10 | absorbed |
| 04 | 19 | clean-shaven |
| 04 | 29 | old-fashioned |
| 04 | 47 | gives it up |
| 04 | 70 | Finnish |
| 05 | 03 | form |
| 05 | 05 | pounded |
| 05 | 11 | tucked |
| 05 | 21 | bowed |
| 05 | 21 | glanced |
| 05 | 25 | straightened |
| 05 | 10 | atop |
| 05 | 22 | drenched |
| 05 | 37 | delivered |
| 05 | 51 | consent |
| 05 | 80 | mean to |
| 06 | 01 | fond of |
| 06 | 01 | laid out |
| 06 | 04 | consisted chiefly of |
| 06 | 04 | resolved |
| 06 | 06 | had an influence on |
| 06 | 07 | determined my father to |
| 06 | 11 | persuaded |
| 06 | 20 | sent me about the town |
| 06 | 25 | spoiling |
| 06 | 40 | delighted |
| 06 | 49 | exact |
| 07 | 01 | evolution |
| 07 | 08 | packed into |
| 07 | 10 | spurred |
| 07 | 12 | monitors |
| 07 | 13 | furnish |
| 07 | 14 | measure |
| 07 | 09 | prime |
| 07 | 18 | consider |
| 07 | 31 | communal |
| 07 | 39 | arrangements |
| 07 | 48 | surroundings |
| 08 | 02 | bizarre |
| 08 | 02 | associated with |
| 08 | 03 | made a spectacle out of |
| 08 | 08 | make fun of |
| 08 | 09 | appropriated |
| 08 | 11 | oppressed |
| 08 | 24 | ramen |
| 08 | 33 | colonization |
| 08 | 49 | laboring |
| 08 | 64 | appropriation |
| 09 | 01 | twisting off |
| 09 | 14 | scurrying |
| 09 | 20 | nibble |
| 09 | 21 | tuck |
| 09 | 23 | saving up |
| 09 | 26 | wander |
| 09 | 09 | paradoxical myth |
| 09 | 18 | contradiction |
| 09 | 30 | chock-full |
| 09 | 36 | gusto |
| 09 | 49 | apathy |
| 10 | 01 | dead language |
| 10 | 01 | uttered |
| 10 | 05 | overlook |
| 10 | 05 | floated |
| 10 | 08 | bordered |
| 10 | 10 | restored |
| 10 | 05 | italicized |
| 10 | 13 | somber |
| 10 | 19 | bluff |
| 10 | 25 | unwholesome |
