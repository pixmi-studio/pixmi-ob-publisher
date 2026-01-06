# Track Plan: Project Foundation & Core WeChat Integration

## Phase 1: Project Initialization & Scaffolding

- [ ] Task: Initialize project with npm and install core dependencies (Vite, Vitest, Axios, Obsidian API)
- [ ] Task: Configure TypeScript and Vite for Obsidian plugin development
- [ ] Task: Create basic plugin entry point (main.ts) and verify it loads in Obsidian
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Project Initialization & Scaffolding' (Protocol in workflow.md)

## Phase 2: Configuration & Credential Management

- [ ] Task: Define settings interface and default settings
- [ ] Task: Implement Settings Tab UI with AppID and AppSecret fields
- [ ] Task: Implement secure storage and retrieval of settings
- [ ] Task: Write tests for settings management
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Configuration & Credential Management' (Protocol in workflow.md)

## Phase 3: WeChat API Client Development

- [ ] Task: Implement WeChat API client for Access Token retrieval with caching
- [ ] Task: Write tests for Access Token service (mocking WeChat API)
- [ ] Task: Implement 'Test Connection' functionality in settings
- [ ] Task: Write tests for Connection Test logic
- [ ] Task: Implement image upload service to WeChat Media Library
- [ ] Task: Write tests for image upload service
- [ ] Task: Conductor - User Manual Verification 'Phase 3: WeChat API Client Development' (Protocol in workflow.md)

## Phase 4: Markdown Processing & Publishing Flow

- [ ] Task: Implement Markdown parser to extract images and convert to WeChat-compatible HTML
- [ ] Task: Write tests for Markdown to HTML conversion (headers, lists, images)
- [ ] Task: Implement core publishing logic: Upload images -> Replace URLs -> Create WeChat Draft
- [ ] Task: Write integration tests for the publishing flow (mocking all external APIs)
- [ ] Task: Add a ribbon icon or command to trigger publishing for the active note
- [ ] Task: Implement user feedback (notifications) for success/failure of publishing
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Markdown Processing & Publishing Flow' (Protocol in workflow.md)

