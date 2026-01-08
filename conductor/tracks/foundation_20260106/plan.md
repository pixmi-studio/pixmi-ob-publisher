# Track Plan: Project Foundation & Core WeChat Integration

## Phase 1: Project Initialization & Scaffolding [checkpoint: 9da637a]

- [x] Task: Initialize project with npm and install core dependencies (Vite, Vitest, Axios, Obsidian API) e018dc5
- [x] Task: Configure TypeScript and Vite for Obsidian plugin development c145834
- [x] Task: Create basic plugin entry point (main.ts) and verify it loads in Obsidian 45a1362
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Project Initialization & Scaffolding' (Protocol in workflow.md)

## Phase 2: Configuration & Credential Management

- [x] Task: Define settings interface and default settings d41d662
- [x] Task: Implement Settings Tab UI with AppID and AppSecret fields 2caa0df
- [x] Task: Implement secure storage and retrieval of settings 3cc3d76
- [x] Task: Write tests for settings management 3238aeb
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Configuration & Credential Management' (Protocol in workflow.md)

## Phase 3: WeChat API Client Development

- [x] Task: Implement WeChat API client for Access Token retrieval with caching 053b161
- [x] Task: Write tests for Access Token service (mocking WeChat API) 053b161
- [x] Task: Implement 'Test Connection' functionality in settings bdffb83
- [x] Task: Write tests for Connection Test logic bdffb83
- [x] Task: Implement image upload service to WeChat Media Library 8b5cc26
- [x] Task: Write tests for image upload service 8b5cc26
- [ ] Task: Conductor - User Manual Verification 'Phase 3: WeChat API Client Development' (Protocol in workflow.md)

## Phase 4: Markdown Processing & Publishing Flow

- [x] Task: Implement Markdown parser to extract images and convert to WeChat-compatible HTML 88e4aac
- [x] Task: Write tests for Markdown to HTML conversion (headers, lists, images) 88e4aac
- [x] Task: Implement core publishing logic: Upload images -> Replace URLs -> Create WeChat Draft f01d9af
- [x] Task: Write integration tests for the publishing flow (mocking all external APIs) 390d733
- [x] Task: Add a ribbon icon or command to trigger publishing for the active note 2e9f896
- [x] Task: Implement user feedback (notifications) for success/failure of publishing 78eb3dd
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Markdown Processing & Publishing Flow' (Protocol in workflow.md)

