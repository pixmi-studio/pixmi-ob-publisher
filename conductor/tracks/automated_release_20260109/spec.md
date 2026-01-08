# Specification: Optimized Automated Release Workflow

## Overview
设计并实现一套基于 GitHub Actions 的全自动发布流程。该流程以 `release` 分支为核心，确保任何进入该分支的代码都会触发发布，并自动维持版本号在 `release` 和 `master` 两个分支间的同步。

## Functional Requirements
- **触发机制**：任何推送到或合并到 `release` 分支的行为都将触发发布流程。
- **版本自动化**：
    - **自动增量**：流程执行时自动增加版本号。如果提交信息符合 Conventional Commits，则按规范判断；若不符合，则**默认按 Patch 增量**发布。
    - **文件更新**：自动同步更新 `package.json`, `manifest.json`, `src/manifest.json`。
- **构建与发布**：
    - 执行 `npm run build`。
    - 创建 GitHub Release，上传 `main.js`, `manifest.json`, `styles.css` (如有)。
    - 生成并更新 `CHANGELOG.md`。
- **双分支同步 (Sync Back)**：
    - 发布完成后，将包含“版本号更新”和“Changelog 更新”的提交**自动合并/同步回 `master` 分支**。
    - 确保 `master` 分支始终持有最新的版本号和变更记录。

## Acceptance Criteria
- [ ] 代码合并到 `release` 分支后，自动触发 Action。
- [ ] 无论提交信息如何，都会产生一个新版本并创建 GitHub Release。
- [ ] 发布成功后，`master` 分支能自动收到来自 `release` 分支的版本号更新提交。
- [ ] `release` 和 `master` 的 `package.json` 版本号保持一致。

## Out of Scope
- 手动干预版本号。
