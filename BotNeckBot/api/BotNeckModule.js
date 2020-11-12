const BotNeckLog = require('./BotNeckLog');

module.exports = class BotNeckModule {
    /**
     * Returns the name of the module
     * @returns {(string|null)} The specified name of the module or null
     */
    get Name() { return null; }
    /**
     * Returns the description of the module
     * @returns {(string|null)} The specified description for the module or null
     */
    get Description() { return null; }
    /**
     * Returns the version of the module (eg. 1.0.0)
     * @returns {(string|null)} The specified version of the module or null
     */
    get Version() { return null; }
    /**
     * Returns the author of the module
     * @returns {(string|null)} The specified author of the module or null
     */
    get Author() { return null; }

    /**
     * Executed when the module is suppose to load
     */
    onLoad() {}
    /**
     * Executed when the module is suppose to unload
     */
    onUnload() {}

    /**
     * Gets the v3 modules that are loaded
     * @returns {[BotNeckModule]}
     */
    static get moduleList() {
        return ModuleManager.Instance.modules.map(loader => loader.module);
    }

    /**
     * Loads the specified module using it's name
     * @param {String} moduleName The name of the module's file to load
     */
    static loadModule(moduleName) {
        if(!moduleName || typeof moduleName !== 'string') return;

        ModuleManager.Instance.loadModule(moduleName);
    }
    /**
     * Unloads the specified module instance
     * @param {BotNeckMoodule} module The module instance to unload
     */
    static unloadModule(module) {
        if(!module || !(module instanceof BotNeckModule)) return;
        let loader = ModuleManager.Instance.modules.find(mod => mod.module === module);
        if(!loader) return;

        ModuleManager.Instance.unloadModule(loader);
    }
    /**
     * Reloads all modules
     * @returns {Promise} Promise to indicate when modules have been reloaded
     */
    static reloadModules() {
        BotNeckLog.log('Reloading modules ...');
        ModuleManager.Instance.unloadModules();
        return ModuleManager.Instance.loadModules();
    }
}
const ModuleManager = require('../core/ModuleManager');