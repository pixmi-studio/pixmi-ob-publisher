const createdSettings = [];

module.exports = {
    Plugin: class Plugin {
        constructor(app, manifest) {
            this.app = app;
            this.manifest = manifest;
        }
        onload() {}
        onunload() {}
        saveData() { return Promise.resolve(); }
        loadData() { return Promise.resolve({}); }
        addSettingTab() {}
    },
    PluginSettingTab: class PluginSettingTab {
        constructor(app, plugin) {
            this.app = app;
            this.plugin = plugin;
        }
        display() {}
    },
    Setting: class Setting {
        constructor(containerEl) {
            this.containerEl = containerEl;
            this.name = '';
            createdSettings.push(this);
        }
        setName(name) { this.name = name; return this; }
        setDesc() { return this; }
        addText(cb) {
             const textMock = {
                setPlaceholder: () => textMock,
                setValue: () => textMock,
                onChange: (onChangeCb) => {
                    this.onChangeCb = onChangeCb;
                    return textMock;
                }
             };
             cb(textMock);
             return this;
        }
        addButton(cb) {
             const buttonMock = {
                setButtonText: () => buttonMock,
                setCta: () => buttonMock,
                onClick: (onClickCb) => {
                    this.onClickCb = onClickCb;
                    return buttonMock;
                }
             };
             cb(buttonMock);
             return this;
        }
    },
    getCreatedSettings: () => createdSettings,
    clearCreatedSettings: () => { createdSettings.length = 0; }
};

// Polyfill Obsidian's DOM extensions
if (typeof HTMLElement !== 'undefined') {
    HTMLElement.prototype.empty = function() {
        this.innerHTML = '';
    };
    HTMLElement.prototype.createEl = function(tag, options) {
        const el = document.createElement(tag);
        if (options && options.text) el.innerText = options.text;
        if (options && options.cls) el.className = options.cls;
        this.appendChild(el);
        return el;
    };
}