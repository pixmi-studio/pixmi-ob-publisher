# Implementation Plan: Isolated Preview Window

This plan outlines the steps to replace the current integrated preview with an isolated, real-time preview window, while cleaning up legacy styling code that impacts Obsidian's native interface.

## Phase 1: Cleanup & Foundation [checkpoint: 22a249f]

- [x] **Task: Remove Legacy Style Injection** 50bce79
- [x] **Task: Create Preview Window Manager Service** 6a20fc4
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Cleanup & Foundation' (Protocol in workflow.md)** 22a249f

## Phase 2: Preview Content & Styling [checkpoint: c62b845]

- [x] **Task: Implement Isolated Style Injection** 1dc6fb1
- [x] **Task: Implement Real-time Data Synchronization** 2f13c07
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Preview Content & Styling' (Protocol in workflow.md)** c62b845

## Phase 3: Integration & User Experience

- [x] **Task: Register Command Palette Trigger** aff93f5
    - [ ] Add the "Open WeChat Publisher Preview" command in `main.ts`.
    - [ ] Link the command to the Preview Window Manager.
- [x] **Task: Handle Active Note Switching** 2358f88
    - [ ] Update the preview window content when the user switches to a different active file in the workspace.
- [ ] **Task: Final Polish & Error Handling**
    - [ ] Add graceful handling for when the preview window is manually closed by the user.
    - [ ] Ensure the preview window closes when the plugin is unloaded.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Integration & User Experience' (Protocol in workflow.md)**
