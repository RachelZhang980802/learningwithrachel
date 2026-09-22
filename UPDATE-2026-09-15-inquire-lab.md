# Inquire Lab 页面更新说明

## 修改内容

- 将全站导航中的 `Reading Guide` 更名为 `Inquire Lab`。
- 将原有 Reading Guide 页面重构为 Reading Path 精读工作台：左侧展示 Arrive、Observe、Interpret、Respond 四个阅读阶段；中间展示所选文章；右侧提供 Notice、Question、Connect 三类引导问题。
- 在材料栏增加现有十篇文章中的三个示例材料，点击后会切换中心阅读内容。
- 增加 `Add an article` 上传入口，接受 PDF、DOCX 和 TXT 文件；选择文件后会显示其文件名，为后续补充外刊文章保留入口。
- 新增说明，明确外刊文章将沿用同一套四步精读和批判性思考引导。

## 涉及文件

- `app/page.tsx`
- `app/globals.css`
- `design-qa.md`

## 验证结果

- `vinext build` 成功完成并预渲染 2 个路由。
- 在本地预览中确认导航显示 `Inquire Lab`。
- 已验证材料切换：选择 `Should the Robots Be Taxed?` 后，标题、作者、主题和节选同步更新。
- 已完成桌面版视觉对照检查，结果记录于 `design-qa.md`：`final result: passed`。
