const BotNeckLog = require('../api/BotNeckLog');
const ConfigManager = require('./ConfigManager');
const { DiscordNetwork, DiscordNetworkCleanup } = require('./DiscordNetwork');
const ModuleManager = require('./ModuleManager');

module.exports = class BotNeckBot {
    constructor() {
        this.discordNetwork = new DiscordNetwork();
        this.moduleManager = new ModuleManager();
        this.configManager = new ConfigManager();

        this.moduleManager.loadModules();
    }
    destroy() {
        BotNeckLog.log('Cleaning up DiscordNetwork ...');
        DiscordNetworkCleanup();
        delete this.discordNetwork;

        BotNeckLog.log('Cleaning up ModuleManager ...');
        this.moduleManager.destroy();
        delete this.moduleManager;

        BotNeckLog.log('Cleaning up ConfigManager ...');
        this.configManager.destroy();
        delete this.configManager;
    }

    static get Name() { return 'BotNeck Bot'; }
    static get Description() { return 'Adds selfbot commands to the Discord client.'; }
    static get Version() { return '3.0.0'; }
    static get Author() { return 'AtiLion'; }
}