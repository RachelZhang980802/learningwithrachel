# Inquire Lab 底部对齐更新

## 修改目标

让右侧的 “HOW IT WORKS” 说明模块与左侧阅读路径的最后一项在底部对齐。

## 修改内容

- 将右侧 `.inquire-prompts` 区域改为纵向弹性布局。
- 使用自动上边距把 `.inquire-upload-note` 推至右侧区域的底部。
- 在手机尺寸下恢复正常的文档流，避免说明模块被拉出合适的位置。

## 涉及文件

- `app/globals.css`

## 验证

- 已在本地 Inquire Lab 页面检查：右侧 “HOW IT WORKS” 模块的下边线与左侧最后一篇文章的底部基线相差 4px，来自两侧原有内边距的差异，视觉上已对齐。
