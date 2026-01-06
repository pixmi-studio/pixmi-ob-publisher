module.exports = {
    Plugin: class Plugin {
        constructor(app, manifest) {
            this.app = app;
            this.manifest = manifest;
        }
        onload() {}
        onunload() {}
    }
};
