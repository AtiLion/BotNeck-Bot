const path = require('path');
const GenericLoader = require('./GenericLoader');
const BotNeckModule = require('../../api/BotNeckModule');
const BotNeckLog = require('../../api/BotNeckLog');

module.exports = class v3Loader extends GenericLoader {
    /**
     * Creates a wrapper around the module that let's you easily load it
     * @param {String} file The module file path to wrap
     * @param {any} module The require of the module to wrap
     */
    constructor(file, module) {
        super(file, module, 'v3Loader');

        /**
         * @type {BotNeckModule}
         */
        this.moduleInstance = null;
    }

    /**
     * Loads the module and starts it
     */
    load() {
        try {
            this.moduleInstance = new this.module();
            this.moduleInstance.onLoad();
        } catch (err) {
            BotNeckLog.error(err, 'Failed to load module', path.basename(this.file));
        }
    }
    /**
     * Stops and unloads the module
     */
    unload() {
        if(!this.moduleInstance) return;

        try {
            let cachedNames = [];
            for(let cachedModule in require.cache) {
                if(!cachedModule.startsWith(this.file)) continue;
                cachedNames.push(cachedModule);
            }
            for(let cachedName of cachedNames)
                delete require.cache[cachedName];

            this.moduleInstance.onUnload();
        } catch (err) {
            BotNeckLog.error(err, 'Failed to load module', path.basename(this.file));
        }
    }

    /**
     * Verifies the module's format if the v2 loader can load the module format
     * @param {String} file The file path to the module
     * @param {any} module The module.exports of the module
     * @returns {Boolean} If the v2 loader can load the module's format
     */
    static verifyFormat(file, module) {
        if(Object.keys(module).length < 1) return false;
        if(!(module.prototype instanceof BotNeckModule)) return false;

        return true;
    }
}