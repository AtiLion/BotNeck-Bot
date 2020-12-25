const fs = require('fs');

module.exports = class BotNeckConfig {
    /**
     * Initializes the configuration (only use with super function)
     * @param {String} configName The configuration file name
     */
    constructor(configName) {
        this.configName = configName;
        this.config = {};
    }

    /**
     * Creates and initializes an instance of the specified configuration
     * @param {BotNeckConfig} type The BotNeckConfig custom type to use for the config
     * @returns {Promise<BotNeckConfig>} The promise that returns the configuration instance
     */
    static create(type) {
        if(!type || !(type.prototype instanceof BotNeckConfig)) return;
        const confInstance = new type();
        const confPath = ConfigManager.Instance.convertNameToPath(confInstance.configName);

        return new Promise((resolve, reject) => {
            if(!fs.existsSync(confPath)) {
                ConfigManager.Instance.saveConfiguration(confInstance.configName, confInstance.config)
                .then(() => resolve(confInstance)).catch(reject);
                return;
            }

            ConfigManager.Instance.loadConfiguration(confInstance.configName)
            .then(conf => {
                confInstance.config = conf;
                resolve(confInstance);
            }).catch(reject);
        });
    }

    /**
     * Saves the configuration to the disk
     * @returns {Promise} A callback for when the configuration is saved
     */
    save() {
        return ConfigManager.Instance.saveConfiguration(this.configName, this.config);
    }
    /**
     * Reloads the configuration from the disk
     * @returns {Promise} A callback for when the configuration is reloaded
     */
    reload() {
        const instance = this;
        const confPath = ConfigManager.Instance.convertNameToPath(instance.configName);

        return new Promise((resolve, reject) => {
            if(!fs.existsSync(confPath)) {
                ConfigManager.Instance.saveConfiguration(confInstance.configName, confInstance.config)
                .then(() => resolve()).catch(reject);
                return;
            }

            ConfigManager.Instance.loadConfiguration(instance.configName)
            .then(conf => {
                instance.config = conf;
                resolve();
            }).catch(reject);
        });
    }
}
const ConfigManager = require('../core/ConfigManager');