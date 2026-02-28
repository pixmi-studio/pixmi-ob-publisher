# Implementation Plan: `theme_optimization_20260228`

## Phase 1: Research & Setup [checkpoint: 9418a28]
1. [x] **Task: 调研与复现排版问题** (5342343)
   - [x] 检查 `src/markdown-parser.ts` 或 `src/publisher.ts` 中的 Markdown 转换为 HTML 的逻辑，找出换行符丢失的原因。
   - [x] 在 `medium geek` 主题中对比当前的 CSS 样式（见 `src/themes.ts`）。
   - [x] 使用开发环境测试上传，通过微信草稿箱验证当前的问题。
2. [x] **Task: Conductor - User Manual Verification 'Phase 1: Research & Setup' (Protocol in workflow.md)** (9418a28)

## Phase 2: Core Refactoring - Layout & Typography
1. [ ] **Task: 修复换行逻辑**
   - [ ] 确保转换后的 HTML 能够保留有效的 `<p>` 标签或 `<br>` 标签（微信偏向段落分割）。
   - [ ] 在 `src/css-converter.ts` 或相关处理逻辑中注入微信偏好的段落样式。
2. [ ] **Task: 优化 `medium geek` 字体与边距**
   - [ ] 修改 `src/themes.ts` 中 `medium geek` 的 `body` padding（增加 15px-20px）。
   - [ ] 统一调整正文及 H1-H6 的 `font-size`，改为 14px-15px 级别并保持层级比例。
   - [ ] 调整 `letter-spacing` 以匹配“极简极客”风格。
3. [ ] **Task: 优化中英文混合排版**
   - [ ] 为全局样式增加 `word-break: break-word` 或 `overflow-wrap: break-word`。
   - [ ] 针对标点符号及数字调整 CSS 特性（如 `font-variant-numeric: tabular-nums`）。
4. [ ] **Task: Conductor - User Manual Verification 'Phase 2: Core Refactoring - Layout & Typography' (Protocol in workflow.md)**

## Phase 3: Visual Styling & Color Scheme
1. [ ] **Task: 重塑 `medium geek` 配色方案**
   - [ ] **引用块**：修改为深灰色/灰蓝边框，背景采用极浅灰/浅蓝灰。
   - [ ] **代码块**：去除生硬配色，采用低对比度、高可读性的“极简极客”方案（仿暗色/极简背景）。
   - [ ] **链接与重点**：调整强调色，确保整体色调和谐统一。
2. [ ] **Task: 全面测试与验证**
   - [ ] 模拟上传包含引用、代码、各级标题及长 URL 的测试文档。
   - [ ] 通过微信小程序“公众号预览”检查移动端展示效果。
3. [ ] **Task: Conductor - User Manual Verification 'Phase 3: Visual Styling & Color Scheme' (Protocol in workflow.md)**
