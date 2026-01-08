# Pixmi Obsidian WeChat Publisher (微信公众号发布助手)

[简体中文] | [English](./README.md)

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/pixmi-studio/pixmi-ob-publisher?style=flat-square)](https://github.com/pixmi-studio/pixmi-ob-publisher/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Buy Me A Coffee](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg?style=flat-square)](https://www.buymeacoffee.com/pixmistudio)
[![GitHub stars](https://img.shields.io/github/stars/pixmi-studio/pixmi-ob-publisher?style=flat-square)](https://github.com/pixmi-studio/pixmi-ob-publisher/stargazers)

一个 Obsidian 插件，支持将 Markdown 笔记直接发布到微信公众号草稿箱。

## 功能特性

- **一键发布**：只需点击一下，即可将当前笔记推送到微信草稿箱。
- **图片处理**：自动处理并上传笔记中引用的本地图片到微信。
- **Markdown 支持**：将 Obsidian Markdown 转换为与微信编辑器兼容的格式。
- **代理支持**：支持自定义 API 代理，轻松绕过微信 IP 白名单限制。
- **无缝集成**：支持侧边栏图标及命令面板快速访问。

## 安装方法

### 从 Obsidian 社区插件安装 (即将推出)

_我们正在向 Obsidian 官方插件库提交审核。_

1. 审核通过后，打开 **设置** > **社区插件**。
2. 点击 **浏览** 并搜索 "Pixmi WeChat Publisher"。
3. 点击 **安装**，然后 **启用**。

### 手动安装 (当前推荐)

1. 从 [Releases](https://github.com/pixmi-studio/pixmi-ob-publisher/releases) 页面下载最新版本的 `pixmi-ob-publisher.zip` 文件。
2. 解压文件，你会得到一个名为 `pixmi-ob-publisher` 的文件夹。
3. 将该文件夹移动到你库的 `.obsidian/plugins/` 目录中。
4. 重启 Obsidian 或重新加载插件，并在 **设置** > **社区插件** 中启用它。

## 配置步骤

在发布之前，你需要配置微信公众号的凭据：

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)。
2. 导航至 **设置与开发** > **基本配置**。
3. 获取你的 **AppID** 和 **AppSecret**。
4. 在 Obsidian 中，打开 **设置** > **Pixmi WeChat Publisher**。
5. 输入你的 AppID 和 AppSecret。
6. (可选) 如果遇到网络问题或 IP 白名单限制，请配置 **API Proxy URL**。

## 使用方法

1. 打开你想发布的笔记。
2. 点击左侧边栏的 **纸飞机** 图标，或者使用命令面板 (`Ctrl/Cmd + P`) 搜索 `Publish to WeChat`。
3. 等待发布成功的通知。
4. 登录微信公众平台，在 **草稿箱** 中即可查看已发布的文章。

## 开发相关

如果你想自行构建插件：

1. 克隆仓库：`git clone https://github.com/pixmi-studio/pixmi-ob-publisher.git`
2. 安装依赖：`npm install`
3. 构建项目：`npm run build`
4. 开发模式（支持热重载）：`npm run dev`

### 运行测试

```bash
npm run test
```

## 贡献指南

欢迎任何形式的贡献！请阅读我们的 [贡献指南](CONTRIBUTING.md) 了解如何开始。

## 支持我们

如果你觉得这个插件有帮助，请考虑点个 Star！

[![Star History Chart](https://api.star-history.com/svg?repos=pixmi-studio/pixmi-ob-publisher&type=Date)](https://star-history.com/#pixmi-studio/pixmi-ob-publisher&Date)

## 开源协议

本项目采用 MIT 协议开源 - 详见 [LICENSE](LICENSE) 文件。

---

由 [Pixmi Studio](https://github.com/pixmi-studio) 开发。
