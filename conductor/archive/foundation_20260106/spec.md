# Track Spec: Project Foundation & Core WeChat Integration

## Overview
This track focuses on setting up the essential structure for the Obsidian plugin and implementing the core functionality to publish notes as drafts to the WeChat Official Account platform.

## User Stories
- **Setup:** As a user, I want to enter my WeChat AppID and AppSecret in the plugin settings so that it can connect to my account.
- **Connection Test:** As a user, I want to verify if my credentials are correct with a 'Test Connection' button.
- **Publish Note:** As a user, I want to click a button to publish my current Obsidian note as a draft in WeChat.
- **Image Handling:** As a user, I want the images in my note to be automatically uploaded to WeChat and display correctly in the published draft.

## Functional Requirements
- **Configuration UI:** A dedicated settings tab in Obsidian for WeChat API credentials.
- **Credential Storage:** Secure local storage of AppID and AppSecret.
- **WeChat API Client:** A service layer to handle:
    - Access Token retrieval and caching.
    - Media upload (for images).
    - Draft creation/update.
- **Markdown Processing:**
    - Parsing the active note.
    - Identifying image links.
    - Transforming Markdown to a format (HTML-like) acceptable by WeChat's draft API.
- **Visual Consistency:** Ensuring basic styling (headers, lists, bold) is preserved in the WeChat draft.

## Non-Functional Requirements
- **Security:** Sensitive keys must never be logged or transmitted to unauthorized endpoints.
- **Performance:** Asynchronous processing of image uploads to prevent UI blocking.
- **Error Handling:** Graceful handling of network errors, invalid credentials, and API rate limits.
- **Code Quality:** Comprehensive unit tests for the API client and Markdown processor.

## Success Criteria
- [ ] Plugin successfully loads in Obsidian.
- [ ] Connection test passes with valid credentials.
- [ ] A test note with text and at least one image is successfully published to the WeChat draft box.
- [ ] The published draft's image matches the local image.

