# Implementation Plan: Isolated Preview Window

This plan outlines the steps to replace the current integrated preview with an isolated, real-time preview window, while cleaning up legacy styling code that impacts Obsidian's native interface.

## Phase 1: Cleanup & Foundation

- [x] **Task: Remove Legacy Style Injection** 50bce79
    - [ ] Identify and remove code in `style-injector.ts` and `main.ts` that applies WeChat-specific styles to Obsidian's native workspace.
    - [ ] Ensure `theme-switcher.ts` no longer affects the main app's DOM.
    - [ ] Verify Obsidian native preview is restored to its default look.
- [x] **Task: Create Preview Window Manager Service** 6a20fc4
    - [ ] Create a new class/module to manage the lifecycle of the external preview window.
    - [ ] Implement a method to open a new window using `window.open` or the Obsidian `Window` API.
    - [ ] Ensure the window instance is tracked to prevent multiple openings.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Cleanup & Foundation' (Protocol in workflow.md)**

## Phase 2: Preview Content & Styling

- [ ] **Task: Implement Isolated Style Injection**
    - [ ] Create a logic to inject theme-specific CSS into the *new window* only.
    - [ ] Ensure the preview window's `<head>` does not inherit any stylesheets from the main Obsidian window.
- [ ] **Task: Implement Real-time Data Synchronization**
    - [ ] Set up an event listener in `main.ts` for editor changes (`editor-change`).
    - [ ] Implement a communication channel (e.g., direct reference or custom events) to send rendered HTML to the preview window.
    - [ ] Implement the receiving logic in the preview window to update its `innerHTML`.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Preview Content & Styling' (Protocol in workflow.md)**

## Phase 3: Integration & User Experience

- [ ] **Task: Register Command Palette Trigger**
    - [ ] Add the "Open WeChat Publisher Preview" command in `main.ts`.
    - [ ] Link the command to the Preview Window Manager.
- [ ] **Task: Handle Active Note Switching**
    - [ ] Update the preview window content when the user switches to a different active file in the workspace.
- [ ] **Task: Final Polish & Error Handling**
    - [ ] Add graceful handling for when the preview window is manually closed by the user.
    - [ ] Ensure the preview window closes when the plugin is unloaded.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Integration & User Experience' (Protocol in workflow.md)**
