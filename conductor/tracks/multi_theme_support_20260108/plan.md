# Implementation Plan: Multi-Theme Support and Preview System

## Phase 1: Theme Management Foundation
*建立主题的基础架构，包括数据结构、加载逻辑和本地目录监控。*

- [x] Task: Define `Theme` interfaces and metadata structures (TDD) ef8d553
- [x] Task: Implement `ThemeManager` to load built-in themes from the plugin bundle 448f096
- [ ] Task: Implement local directory monitoring (`.obsidian/pixmi-themes/`) to load custom CSS files
- [ ] Task: Conductor - User Manual Verification 'Theme Management Foundation' (Protocol in workflow.md)

## Phase 2: UI & Switching Logic
*实现用户交互界面，允许用户切换主题并自动同步到文档配置。*

- [ ] Task: Create `ThemeSwitcher` logic to detect and update `pixmi-theme` in Frontmatter (TDD)
- [ ] Task: Add "Switch WeChat Theme" command to the Command Palette
- [ ] Task: Implement a Status Bar or Ribbon icon to show and change the current theme
- [ ] Task: Conductor - User Manual Verification 'UI & Switching Logic' (Protocol in workflow.md)

## Phase 3: Native Preview Integration
*将主题样式注入到 Obsidian 的原生预览中，并确保样式隔离。*

- [ ] Task: Implement `StyleInjector` to dynamically apply CSS to the Markdown preview container
- [ ] Task: Implement CSS scoping logic to ensure themes only affect content, not Obsidian UI (TDD)
- [ ] Task: Add event listeners to refresh styles when the active file or Frontmatter changes
- [ ] Task: Conductor - User Manual Verification 'Native Preview Integration' (Protocol in workflow.md)

## Phase 4: Publishing Integration (Inline CSS)
*实现发布时的样式转换逻辑，确保微信文章与预览一致。*

- [ ] Task: Implement a CSS-to-Inline-Style converter (TDD)
- [ ] Task: Integrate the converter into the `Publisher` flow to apply the selected theme before sending to WeChat
- [ ] Task: Handle image and asset-specific styling during the conversion process
- [ ] Task: Conductor - User Manual Verification 'Publishing Integration' (Protocol in workflow.md)

## Phase 5: Built-in Themes & Final Polish
*创建三个预设主题的 CSS 内容，并进行最后的整体测试。*

- [ ] Task: Design and implement the 'Minimalist' theme CSS
- [ ] Task: Design and implement the 'Technical' theme CSS (with Code Block/MathJax support)
- [ ] Task: Design and implement the 'Modern Magazine' theme CSS
- [ ] Task: Final end-to-end integration test of the entire theme-to-publish flow
- [ ] Task: Conductor - User Manual Verification 'Built-in Themes & Final Polish' (Protocol in workflow.md)
