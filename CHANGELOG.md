# [1.4.0](https://github.com/pixmi-studio/pixmi-ob-publisher/compare/v1.3.0...v1.4.0) (2026-02-01)


### Bug Fixes

* **core:** 优化图片处理逻辑并更新测试模拟 ([1450723](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/14507234084ca888fb74dcd963c5e82f4acf10e1))
* **preview:** Add debug logging and use 'about:blank' for window.open ([d4d4b46](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/d4d4b46b0d85bbe11d8ecca94cf6ea839b33a57d))
* **preview:** Enhance style injection specificity and remove frontmatter from publish ([6446ab1](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/6446ab1444f3e075e2d25e19a2882587fd122473))
* **preview:** Ensure preview window closes on plugin unload ([556711f](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/556711fe4ba8d848ee6fb2f8abf7bd6278060e53))
* **publishing:** Enhance WeChat compatibility (inline styles, images, themes) ([d29452a](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/d29452a4cd82f0d67377cedb93feb60f430e7150))


### Features

* **preview:** Implement isolated style injection for preview window ([1dc6fb1](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/1dc6fb1607a44a0f773f89c8d1573b05bb73d322))
* **preview:** Implement native preview integration with CSS scoping ([b1fc0c4](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/b1fc0c4a80542f633e6eb54f160233de7b402b37))
* **preview:** Implement PreviewWindowManager service ([6a20fc4](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/6a20fc485c4f9eb696a5915ebb68806e201929a8))
* **preview:** Implement real-time data synchronization with preview window ([2f13c07](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/2f13c07579c8eb1bd7427f4de0a9133c88872aec))
* **preview:** Register command to open isolated preview ([aff93f5](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/aff93f5ff7c60cee5dd761a3ab923b07d6e018bb))
* **preview:** 重构预览窗口以实现所见即所得 ([150c850](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/150c850205a16af90cbe759b77220eb2d3486f1e))
* **publish:** Integrate CSS-to-Inline converter into publishing flow ([df94b29](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/df94b296d6e9267735cba9b8d8068e7dabbb8ee0))
* **theme:** Comprehensive CSS update for all builtin themes ([1843f59](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/1843f59ff798e93d3cb0ce85ef978a442df5a26a))
* **theme:** Expand Minimalist theme for consistent typography across preview and publish ([d6061c6](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/d6061c655c142af559836dcd77a0139734b617f1))
* **theme:** refine built-in themes, fix publishing styles, and complete theme integration ([a3a5df2](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/a3a5df2a18fe7d3cf40d09cada07949b45dfb913))
* **themes:** define Theme interfaces and metadata structures ([ef8d553](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/ef8d5533029da2e1be466ce4ea14557d761b331a))
* **themes:** implement custom theme loading from local directory ([123e7eb](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/123e7ebd34c4dac0a42154f7276323544403da31))
* **themes:** implement ThemeManager with builtin themes ([448f096](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/448f096de0186ae3ec5d747464e815f97af659b9))
* **ui:** Add 'Original' theme and improve status bar spacing ([28aae98](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/28aae989ec579713a1fa2dec6bca3bd7d96c6a7a))
* **ui:** add 'Switch WeChat Theme' command and ThemeSuggester ([f2b9dca](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/f2b9dcaf08aec50a6c28e0c070ce3f821644f5a3))
* **ui:** add Status Bar item for theme display and switching ([0438776](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/043877690c6f966b11dd1a92bed7e0d65a8c020f))
* **ui:** implement ThemeSwitcher for frontmatter management ([0cbc77a](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/0cbc77a17431a3d349a908aa829c11a9d0e24c9a))
* **ui:** Remove redundant 'Original' theme ([79a6df2](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/79a6df2e2f93ea0972b9ef986219a5753f70bcaa))

# [1.3.0](https://github.com/pixmi-studio/pixmi-ob-publisher/compare/v1.2.0...v1.3.0) (2026-01-08)


### Features

* **release:** only upload zip archive to github release ([7af17eb](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/7af17eb0e6b504068cb911ab02ae791ca3326733))

# [1.2.0](https://github.com/pixmi-studio/pixmi-ob-publisher/compare/v1.1.0...v1.2.0) (2026-01-08)


### Features

* **release:** make packaging script robust to handle all dist assets ([002b5b2](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/002b5b21e30b47a9cca2b73c514fc4e41d550d87))
* **release:** package plugin files into a zip for manual installation ([5089d61](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/5089d61bec624acde2eed81d829aba9eeb6687eb))

# [1.1.0](https://github.com/pixmi-studio/pixmi-ob-publisher/compare/v1.0.12...v1.1.0) (2026-01-08)


### Bug Fixes

* **release:** switch preset to angular to avoid missing dependency ([4bc8f35](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/4bc8f35fa6b553f23fe5f44c3ff556e9d386b51e))


### Features

* **release:** configure GitHub Actions workflow for automated release ([488bad1](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/488bad1841170db48f633678496c5b81365049e4))
* **release:** implement dual-branch synchronization workflow ([e9a7980](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/e9a7980d078ab41a81e46163a518c7db4355cd2d))
* **release:** integrate semantic-release and version sync logic ([8cb9400](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/8cb94009299df45f762d88b108026802ac714d8e))
* 改进发布失败时的友好错误提示 ([f38b01d](https://github.com/pixmi-studio/pixmi-ob-publisher/commit/f38b01d8fca37b0d457e56631c8061875287eec7))
