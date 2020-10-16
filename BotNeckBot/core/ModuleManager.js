const fs = require('fs');
const path = require('path');
const Sandbox = require('./Sandbox');

module.exports = class ModuleManager {
    constructor() {
        this.modulesDirectory = '../modules';
        this.modules = [];

        if(!fs.existsSync(this.modulesDirectory))
            throw 'The modules directory does not exist!';
    }
    destroy() {
    }

    loadModule(moduleName) {
        const modulePath = path.resolve(this.modulesDirectory, moduleName);
        if(!fs.existsSync(modulePath)) return;

        const moduleSandbox = new Sandbox(modulePath);
        moduleSandbox.onLoad();
        this.modules.push(moduleSandbox);
    }
}