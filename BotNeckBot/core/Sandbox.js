const BotNeckModule = require('../api/BotNeckModule');

module.exports = class Sandbox extends BotNeckModule {
    constructor(filePath) {
        this.safeRequire = require.bind({}); // Re-create to prevent shared memory between modules
        this.module = this.safeRequire(filePath);
        this.instance = new this.module();
    }

    invokeFunction(func, ...args) {
        return this.instance[func].bind(this.instance)(...args);
    }
    getPropertyValue(property) {
        return this.instance[property];
    }
    setPropertyValue(property, value) {
        this.instance[property] = value;
    }

    get Name() { return this.getPropertyValue('Name'); }
    get Description() { return this.getPropertyValue('Description'); }
    get Version() { return this.getPropertyValue('Version'); }
    get Author() { return this.getPropertyValue('Author'); }

    onLoad() { return this.invokeFunction('onLoad'); }
    onUnload() { return this.invokeFunction('onUnload'); }

    registerCommand(command) { return this.invokeFunction('registerCommand', command); }
    unregisterCommand(command) { return this.invokeFunction('unregisterCommand', command); }
}