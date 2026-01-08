# Plan: Optimized Automated Release Workflow

## Phase 1: Infrastructure & Versioning Logic
设计并实现自动版本递增和文件同步的核心逻辑。

- [ ] Task: 调研并集成语义化版本管理工具 (如 semantic-release) `[target: package.json]`
- [ ] Task: 编写测试验证版本更新逻辑（确保非规范提交默认升级 Patch）
- [ ] Task: 实现自动同步版本号至 `package.json`, `manifest.json`, `src/manifest.json`
- [ ] Task: 实现自动更新 `versions.json` (Obsidian 插件版本历史)
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Versioning Logic' (Protocol in workflow.md)

## Phase 2: GitHub Actions Workflow
配置 GitHub Actions 实现全自动发布流。

- [ ] Task: 创建 `.github/workflows/release.yml` 基础配置，监听 `release` 分支
- [ ] Task: 配置构建步骤，确保在 Action 环境中生成插件产物 (`main.js`, `manifest.json`)
- [ ] Task: 配置发布步骤，自动创建 GitHub Release 并上传附件
- [ ] Task: 配置 Changelog 自动生成逻辑
- [ ] Task: Conductor - User Manual Verification 'Phase 2: GitHub Actions Workflow' (Protocol in workflow.md)

## Phase 3: Dual-Branch Synchronization
实现发布后的双分支同步机制。

- [ ] Task: 编写脚本或配置 Action，在发布成功后将版本更新提交同步回 `master` 分支
- [ ] Task: 处理同步过程中的冲突预防逻辑
- [ ] Task: 最终集成测试：模拟从 `master` 合并至 `release` 并触发完整流程
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Dual-Branch Synchronization' (Protocol in workflow.md)
