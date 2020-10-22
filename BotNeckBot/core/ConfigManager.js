const BotNeckLog = require('../api/BotNeckLog');

let _instance = null;
module.exports = class ConfigManager {
    /**
     * Creates the ConfigManager to handle configuration files
     */
    constructor() {
        if(_instance) {
            BotNeckLog.error('ConfigManager instance already exists!');
            return;
        }
        _instance = this;
    }
    /**
     * Destroys and cleans up the ConfigManager instance
     */
    destroy() {
        BotNeckLog.log('Cleaning up ConfigManager ...');
        _instance = null;
    }

    /**
     * Returns the main instance of ConfigManager
     * @returns {ConfigManager} The instance of config manager
     */
    static get Instance() { return _instance; }
}