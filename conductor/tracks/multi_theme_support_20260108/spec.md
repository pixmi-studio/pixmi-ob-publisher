# Specification: Multi-Theme Support and Preview System

## Overview
为 Pixmi Obsidian WeChat Publisher 增加多主题支持。用户可以为笔记选择不同的视觉样式，并在 Obsidian 原生预览模式中实时查看效果。系统应保证预览效果与发布到微信公众平台后的效果高度一致，并支持用户通过 CSS 文件自行扩展主题。

## Functional Requirements

### 1. 主题管理与内置主题
- **内置主题库**：提供三种预设主题：
    - **极简风格 (Minimalist)**：侧重排版与阅读体验。
    - **学术/技术风格 (Technical)**：优化代码块、数学公式（MathJax）展示。
    - **现代杂志风格 (Modern Magazine)**：大字号、开阔间距的现代感设计。
- **自定义扩展**：插件将读取特定的本地文件夹（如 `.obsidian/pixmi-themes/`），用户放入 `.css` 文件即可识别为新主题。

### 2. 主题切换机制
- **Frontmatter 配置**：支持在 YAML 中通过 `pixmi-theme: <theme-name>` 指定主题。
- **快捷切换**：
    - 提供命令面板命令：`Switch WeChat Theme`。
    - 在状态栏或文档编辑器右上角显示当前主题，点击可弹出主题选择列表。
- **实时同步**：切换主题后，YAML 属性应自动更新，且 Obsidian 原生预览立即生效。

### 3. 原生预览集成 (WYSIWYG)
- **样式注入**：插件将选定主题的 CSS 动态注入到 Obsidian 的 Markdown 预览容器中。
- **样式隔离 (Scoping)**：通过为预览容器添加特定命名空间类名（如 `.pixmi-preview-container`），确保主题 CSS 仅作用于正文内容，不干扰 Obsidian 自身的 UI。

### 4. 发布转换逻辑
- **内联化转换**：在用户点击“发布”时，插件将当前的 CSS 样式计算并转换为内联 `style` 属性，以适配微信公众平台的限制。
- **一致性保证**：发布时的转换逻辑应严格遵循预览时的 CSS 规则，确保“所见即所得”。
- **图片处理**：自动识别 Markdown 中的图片，调用微信接口上传并替换为微信专用 URL，防止防盗链问题。

### 5. 微信兼容性约束 (WeChat Compatibility Constraints)
- **纯内联样式 (Inline Styles Only)**：微信编辑器不支持外部 CSS 文件或 `<style>` 标签。所有样式必须通过工具转换为 HTML 标签的 `style="..."` 属性。
- **图片防盗链 (Image Anti-hotlinking)**：外部图片（如 GitHub、Unsplash）直接链接会失效。必须先提取 URL，调用微信“上传图文消息内的图片获取URL”接口，并替换为 `http://mmbiz.qpic.cn/...` 链接。
- **代码块换行 (Code Blocks)**：为防止代码挤成一行，必须显式添加 `white-space: pre-wrap;` 和 `word-break: break-all;` 到 `<code>` 标签或其父级。
- **无伪元素 (No Pseudo-elements)**：内联样式不支持 `::before` 和 `::after`。所有装饰性元素（如列表前的点、引用符号）必须通过 `border`、`background` 或真实 DOM 元素实现。
- **HTML 结构包裹**：所有内容外层应包裹 `<section class="wechat-container">` 以确保排版隔离。

## Non-Functional Requirements
- **性能**：主题切换应在 100ms 内完成，不造成界面卡顿。
- **易用性**：主题 CSS 文件应易于编写，遵循标准的 Markdown 元素选择器。

## Acceptance Criteria
- [ ] 用户可以通过 YAML 属性更改笔记主题。
- [ ] 用户可以通过命令面板或 UI 按钮切换主题。
- [ ] Obsidian 原生预览模式能正确渲染所选主题的样式。
- [ ] 切换主题不影响 Obsidian 软件本身的 UI（如侧边栏、菜单等）。
- [ ] 用户添加自定义 CSS 文件后，重启插件或执行刷新命令后可识别。
- [ ] 发布到微信草稿箱后的文章排版与 Obsidian 预览基本一致。

## Out of Scope
- 开发可视化的主题编辑器。
- 支持基于 JavaScript 的动态主题逻辑。
