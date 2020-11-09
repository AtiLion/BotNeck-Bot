const ModuleManager = require('../core/ModuleManager');

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
}