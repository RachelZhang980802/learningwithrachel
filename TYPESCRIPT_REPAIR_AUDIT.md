# TypeScript 报错修复与网页回归检查

日期：2026-10-22。修复原有 13 条 TypeScript 报错，并重新检查页面。

## 结果

- `npm run typecheck` 退出码 0：前端与 Worker 两套严格检查均通过。
- 两套配置合计覆盖原配置纳入检查的全部 169 个文件（统计包含本次新增的类型声明）；未关闭 strict，也未添加忽略错误指令。
- 87 项回归测试通过：结构、词汇、词卡布局以及 6 项媒体读取测试。
- 浏览器重新遍历全部 547 个 Structure 页面：英文标签、颜色、原文覆盖、中文解释通过。
- 967 个正文生词高亮与原基线一致，实际抽查 106 次词卡跳转，目标词条和句号全部正确。
- 1,205 处正文谓语标记的实际字符范围、底色及词组内部下划线颜色全部通过。
- 每篇正文在 320、390、600、768、910、1280 像素宽度检查标注碰撞和溢出；每篇首句、中间句、末句另检查手机 Structure 布局。

## 修复明细

| 文件 | 修复 | 既有行为 |
| --- | --- | --- |
| app/EditableTextLayer.tsx | 定时器引用采用浏览器实际返回的 number | 编译后的 JavaScript 完全相同 |
| app/GrammarExerciseText.tsx | 仅在上一行存在时计算平均高度 | 64 份练习文本片段与修复前的排列结果完全相同 |
| app/inquire-healthy-love-article.ts | 补齐 InquireFeatureArticle 类型导入 | 类型导入被编译移除，运行时 JavaScript 相同 |
| app/inquire-li-ziqi-article.ts | 显式补充空 dek 字段 | 维持不显示导语，正文不变 |
| app/narrativeWritingMarkup.ts | 接受 readonly 选项和现有 null 答案 | 不改动题目或答案，编译后 JavaScript 相同 |
| vite.config.ts | 指定 ViteDevServer 类型，恢复中间件参数推导 | 编译后 JavaScript 相同 |
| worker/runtime.d.ts | 使用已有 Wrangler/workerd 生成官方运行时类型 | 仅声明，不参与网页运行 |
| worker/env.d.ts | 声明可选 DB 绑定 | 保留 getDb 的原有缺失绑定检查 |
| tsconfig.json / tsconfig.worker.json | 将浏览器 DOM 与 Workers 类型环境分开检查 | 类型环境不再相互污染，两边都由 typecheck 命令验证 |
| worker/index.ts | 明确处理可选范围长度、起点和后缀范围 | 完整读取与分段读取均通过测试，音频入口不变 |

## 可重复验证

```sh
npm run typecheck
npm run types:workers
node --test tests/worker-media-range.test.mjs tests/article*-structure-sync.test.mjs tests/articles01to05-vocabulary-audit.test.mjs tests/vocabulary-integrity.test.mjs tests/article06-batch1-audit.test.mjs tests/article0[7-9]-curated-audit.test.mjs tests/article10-curated-audit.test.mjs tests/curated-word-layout.test.mjs
```

`worker/types.wrangler.jsonc` 仅用于生成类型；兼容日期和 nodejs_compat 沿用现有生成的 Worker 配置。部署绑定仍由原有 vite.config.ts 和 .openai/hosting.json 管理。未新增 npm 依赖。

## 分篇复查

| 文章 | Structure 页面数 | 生词高亮数 | 实际跳转抽查 | 结果 |
| --- | ---: | ---: | ---: | --- |
| 01 | 40 | 62 | 11 | 通过 |
| 02 | 48 | 55 | 10 | 通过 |
| 03 | 66 | 85 | 10 | 通过 |
| 04 | 75 | 69 | 11 | 通过 |
| 05 | 80 | 78 | 11 | 通过 |
| 06 | 49 | 156 | 11 | 通过 |
| 07 | 48 | 145 | 11 | 通过 |
| 08 | 65 | 145 | 10 | 通过 |
| 09 | 50 | 86 | 11 | 通过 |
| 10 | 26 | 86 | 10 | 通过 |

十篇解析后的句法、中文说明和词汇数据与修复前逐项比较一致。逐句对应关系见 [总核对表](ARTICLES_01_10_STRUCTURE_AUDIT.md)。
