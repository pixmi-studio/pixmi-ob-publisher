# Pixmi Obsidian WeChat Publisher

[English] | [简体中文](./README_zh.md)

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/pixmi-studio/pixmi-ob-publisher?style=flat-square)](https://github.com/pixmi-studio/pixmi-ob-publisher/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Buy Me A Coffee](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg?style=flat-square)](https://afdian.com/a/pixmi-studio)
[![GitHub stars](https://img.shields.io/github/stars/pixmi-studio/pixmi-ob-publisher?style=flat-square)](https://github.com/pixmi-studio/pixmi-ob-publisher/stargazers)

An Obsidian plugin that allows you to publish your Markdown notes directly to your WeChat Official Account (公众号) draft box.

## Features

- **Direct Publishing**: Push your active note to WeChat drafts with a single click.
- **Image Handling**: Automatically processes and uploads local images referenced in your notes to WeChat.
- **Markdown Support**: Converts Obsidian Markdown to a format compatible with WeChat's editor.
- **Proxy Support**: Bypasses WeChat IP whitelist restrictions using a custom API proxy.
- **Seamless Integration**: Use the ribbon icon or command palette for quick access.

## Installation

### From Obsidian Community Plugins (Coming Soon)

_We are currently in the process of submitting this plugin to the official Obsidian directory._

1. Once approved, open **Settings** > **Community plugins**.
2. Click **Browse** and search for "Pixmi WeChat Publisher".
3. Click **Install**, then **Enable**.

### Manual Installation (Current Method)

1. Download the `pixmi-ob-publisher.zip` file from the latest release on the [Releases](https://github.com/pixmi-studio/pixmi-ob-publisher/releases) page.
2. Unzip the file. It will create a folder named `pixmi-ob-publisher`.
3. Move this folder into your vault's `.obsidian/plugins/` directory.
4. Reload Obsidian and enable the plugin in **Settings** > **Community plugins**.

## Configuration

Before publishing, you need to configure your WeChat Official Account credentials:

1. Go to your [WeChat Official Account Platform](https://mp.weixin.qq.com/).
2. Navigate to **Settings and Development** > **Basic Configuration**.
3. Locate your **AppID** and **AppSecret**.
4. In Obsidian, go to **Settings** > **Pixmi WeChat Publisher**.
5. Enter your AppID and AppSecret.
6. (Optional) If you face network issues or IP whitelist restrictions, configure an **API Proxy URL**.

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

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details on how to get started.

## Support

<a href="https://afdian.com/a/pixmi-studio"><img width="142" src="https://pic1.afdiancdn.com/static/img/welcome/button-sponsorme.png" alt=""></a>


If you find this plugin helpful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=pixmi-studio/pixmi-ob-publisher&type=Date)](https://star-history.com/#pixmi-studio/pixmi-ob-publisher&Date)



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed by [Pixmi Studio](https://github.com/pixmi-studio).
