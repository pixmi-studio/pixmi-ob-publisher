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
        addRibbonIcon() {}
        addCommand() {}
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
    Modal: class Modal {
        constructor(app) {
            this.app = app;
            this.contentEl = document.createElement('div');
        }
        open() { this.onOpen(); }
        close() { this.onClose(); }
        onOpen() {}
        onClose() {}
    },
    TextAreaComponent: class TextAreaComponent {
        constructor(containerEl) {
            this.inputEl = document.createElement('textarea');
            containerEl.appendChild(this.inputEl);
        }
        setValue() { return this; }
        setDisabled() { return this; }
    },
    ButtonComponent: class ButtonComponent {
        constructor(containerEl) {
            this.buttonEl = document.createElement('button');
            containerEl.appendChild(this.buttonEl);
        }
        setButtonText() { return this; }
        setWarning() { return this; }
        onClick(cb) { this.onClickCb = cb; return this; }
    },
    Notice: class Notice {
        constructor(message) {}
    },
    requestUrl: async () => {
        return {
            status: 200,
            json: {},
            arrayBuffer: new ArrayBuffer(0)
        };
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
    HTMLElement.prototype.createDiv = function() {
        const el = document.createElement('div');
        this.appendChild(el);
        return el;
    };
}