# Pixmi Obsidian WeChat Publisher

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/pixmi-studio/pixmi-ob-publisher?style=flat-square)](https://github.com/pixmi-studio/pixmi-ob-publisher/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

An Obsidian plugin that allows you to publish your Markdown notes directly to your WeChat Official Account (公众号) draft box.

## Features

- **Direct Publishing**: Push your active note to WeChat drafts with a single click.
- **Image Handling**: Automatically processes and uploads local images referenced in your notes to WeChat.
- **Markdown Support**: Converts Obsidian Markdown to a format compatible with WeChat's editor.
- **Seamless Integration**: Use the ribbon icon or command palette for quick access.

## Installation

### From Obsidian Community Plugins (Coming Soon)

_We are currently in the process of submitting this plugin to the official Obsidian directory._

1. Once approved, open **Settings** > **Community plugins**.
2. Click **Browse** and search for "Pixmi WeChat Publisher".
3. Click **Install**, then **Enable**.

### Manual Installation (Current Method)

1. Download the latest release (`main.js`, `manifest.json`) from the [Releases](https://github.com/pixmi-studio/pixmi-ob-publisher/releases) page.
2. Create a folder named `pixmi-ob-publisher` in your vault's `.obsidian/plugins/` directory.
3. Copy the downloaded files into that folder.
4. Reload Obsidian and enable the plugin in **Settings** > **Community plugins**.

## Configuration

Before publishing, you need to configure your WeChat Official Account credentials:

1. Go to your [WeChat Official Account Platform](https://mp.weixin.qq.com/).
2. Navigate to **Settings and Development** > **Basic Configuration**.
3. Locate your **AppID** and **AppSecret**.
4. In Obsidian, go to **Settings** > **Pixmi WeChat Publisher**.
5. Enter your AppID and AppSecret.
6. (Optional) Whitelist your IP address in the WeChat platform settings if required.

## Usage

1. Open the note you want to publish.
2. Click the **Paper Plane** icon in the left ribbon, or use the command palette (`Ctrl/Cmd + P`) and search for `Publish to WeChat`.
3. Wait for the notification confirming successful publishing.
4. Log in to your WeChat Official Account Platform to find the note in your **Drafts**.

## Development

If you want to build the plugin yourself:

1. Clone the repository: `git clone https://github.com/pixmi-studio/pixmi-ob-publisher.git`
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build`
4. For development with hot-reload: `npm run dev`

### Running Tests

```bash
npm run test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed by [Pixmi Studio](https://github.com/pixmi-studio).
