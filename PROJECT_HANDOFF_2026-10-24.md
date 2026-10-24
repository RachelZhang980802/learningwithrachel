# 网站内容更新：新聊天交接（2026-10-24）

## 项目与本地预览

- 实际 Git 项目：`/Users/rachel/Downloads/网页设计/learningwithrachel`。Codex 旧登记路径 `/Users/rachel/Documents/ChatGPT/网页设计` 已不存在；不要在那个路径新建或修改网站。
- 当前分支：`deploy/aliyun-2026-10-22`。写此记录前工作区干净，最近的网页代码提交为 `cb5d586`（页脚显示 ICP 备案号）。先检查 `git status`，保留此后用户和其他聊天新增的文件与改动。
- 本地开发服务器命令：`npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`。2026-10-24 已核对 5173 端口由此项目的 Vite 进程提供，首页 HTTP 200，HTML 含备案号。
- 本地浏览地址：`http://127.0.0.1:5173/`。仅当本机开发服务器运行时可用；不能把它当作线上网址。

## 已完成的线上迁移

- 正式网站：`https://negentropylearning.com.cn/`，`https://www.negentropylearning.com.cn/`；Cloudflare DNS 已指向阿里云成都 ECS。`www` 指向主域名；`preview.negentropylearning.com.cn` 是独立预览站。
- 阿里云 ECS：Ubuntu 22.04，Nginx + Node 24，systemd 服务 `learningwithrachel`，版本目录 `/opt/learningwithrachel/releases/`，当前版本软链接 `/opt/learningwithrachel/current`。HTTPS 证书由 Certbot 管理；此前主域名、www 的本地 TLS 检查及证书续期模拟均通过。
- 用户在手机上确认正式 `www` 首页、课程页、图片和音频正常。旧的 Vercel 部署仍可作为回退来源，但 GitHub/Vercel 自动构建不等于更新阿里云正式站。
- 图片、音频等媒体存于 Cloudflare R2，使用 `assets.negentropylearning.com.cn`。不要把密钥或 API Token 写入仓库、聊天记录或网页。大陆访问 R2 图片曾反馈较慢；最近已把多张大图优化成 WebP，但若再出现慢加载，应先量测页面、资源大小与请求时间。
- ICP 备案号 `蜀ICP备2026060108号` 已加入站点页脚并链接到工信部备案查询。新的网页代码提交为 `cb5d586`。上线后的实际显示应按正式站重新核验。
- 上次用户贴出的 ECS 更新结果为 `UPDATE_READY: /opt/learningwithrachel/releases/20261024T091442Z`，回退版本 `/opt/learningwithrachel/releases/20261024T001556Z`；此为历史记录，后续先核查服务器现状，不要假设它始终是当前版本。

## 今后更新网站的顺序

1. 先备份本地成果，核查分支、工作区和现有内容；按用户的新材料修改网页，避免覆盖其他工作。
2. 新增或变更图片/音频时，优化文件大小并上传 Cloudflare R2，确保网页使用实际可访问的媒体 URL。
3. 本地预览，按改动运行必要检查；常用命令 `npm run typecheck`。构建阿里云包：`npm run build:aliyun`，然后 `node scripts/package-aliyun.mjs`；归档及 SHA-256 清单在 `dist/aliyun/`。
4. 代码提交并推送 GitHub；将校验过 SHA-256 的构建包传到 ECS，按 `deploy/aliyun/README.md` 与 `deploy/aliyun/update-release.sh` 更新。更新脚本会保留上一版，并在健康检查失败时回退。不要把“GitHub 推送成功”误认为阿里云站已经更新。
5. 检查主域名和 `www` 的首页、受影响课程页、R2 图片/音频、移动端与备案页脚。确认正式站可用后才宣告完成。日常更新不需要再改 DNS、证书或域名备案。

## 用户已表达的设计与协作偏好

- 需要清晰、逐步的中文说明；能自行完成的核查和可逆工作直接做，尽量减少重复确认。
- 西方文化章节左侧黑色章节框：点击章节标题时，右侧只展示背景图，不自动弹出文字框；点击标题下的具体内容时才展示对应文字。章节背景图要尽量完整，避免两侧黑边。
- 首页、二级页、西方文化、叙事写作的主导航保留图案、网站名和各自菜单，采用细长布局、普通字重和细红色选中下划线。
- 这些是过去需求，不代表新聊天要擅自重做。新聊天应先等用户提供新网页内容及具体要求，再编辑对应页面。

## 参考文件

- `README.md`：项目概览与本地开发。
- `deploy/aliyun/README.md`：阿里云打包和更新机制。
- `deploy/aliyun/PRODUCTION-MIGRATION.md`：迁移与 DNS 回退记录，仅供故障排查，日常更新无需重复迁移。
- `PROJECT_HANDOFF_2026-10-18.md`、`PROJECT_HANDOFF_2026-10-20.md`：早期课程内容与设计交接；其中时间敏感的状态均以当前项目为准。
