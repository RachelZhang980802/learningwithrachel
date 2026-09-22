# 句型图标素材 · 2026-09-06

本次为独立设计预览，入口为 `/sentence-badges-preview.html`，未接入正式阅读卡片。

状态（2026-09-06）：用户对当前设计不满意，要求保留记录、下次再修改。此方案未获认可，暂不应用；详见项目根目录 `句型图标设计-待修改记录.md`。

- 第一张图：`simple-cat.png`，简单句；第 37 句简短回应也使用此图，但保留“非完整句”标签。
- 第二张图：`complex-cat.png`，复合结构；细分主从复合、并列、并列复合，第 36 句引语结构单列。
- 分类数据：`article01-classification.json`，含全部 40 句原文、类型、教学优先级、判断依据。
- 两张 PNG 均为 1729 × 910，实际 RGBA 透明背景；保留白色主体和紫色内耳。
- 生成方式：内置 ImageGen 编辑模式。原图为 `/Users/mac/Downloads/IMG_3674.JPG` 与 `/Users/mac/Downloads/IMG_3673.JPG`。这是生成式抠图，线条细节可能轻微重绘，并非逐像素复制。
- 标准显示尺寸：正面 104 px 宽，背面 88.4 px 宽；按比例缩放，不拉伸。

## 最终提示词 · 第一张

Use case: background-extraction. Asset type: a small transparent PNG sentence-classification badge for a reading website, displayed about 82–110 px wide. Input image 1 is the edit target. Extract the original upright cloaked cartoon cat together with the laptop to its left and the two short attention marks above the laptop. Preserve the exact original proportions, pose, face, rough hand-drawn black lines and texture, solid white face and laptop surface, and tiny purple inner ears. Change only the surrounding white page to actual transparent alpha, removing surrounding page marks and text. Keep white fills that belong to the cat and laptop fully opaque; the open gap between the cloak sides and the space around separate objects should be transparent. Crop tightly around the complete cat-and-laptop group with a small even transparent margin; horizontal composition roughly 1.9:1, no large empty margins. No new objects, no new shadow, no redraw or stylistic change, no text. Deliver a genuine transparent-background PNG, not a checkerboard baked into pixels.

## 最终提示词 · 第二张

Use case: background-extraction. Asset type: a small transparent PNG sentence-classification badge for a reading website, displayed about 82–110 px wide. Input image 1 is the edit target. Extract the original stretched cartoon cat together with its desktop computer, desk, office chair and attention marks. Preserve the exact original proportions, pose, face, rough hand-drawn black lines and texture, solid white body and computer surface, and tiny purple inner ears. Change only the surrounding white page to actual transparent alpha, removing surrounding page marks and text. Keep white fills that belong to the cat and computer fully opaque; open gaps around separate objects should be transparent. Crop tightly around the complete cat-and-computer group with a small even transparent margin; horizontal composition roughly 1.9:1, no large empty margins. No new objects, no new shadow, no redraw or stylistic change, no text. Deliver a genuine transparent-background PNG, not a checkerboard baked into pixels.
