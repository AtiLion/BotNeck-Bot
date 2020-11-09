const BotNeckLog = require('../api/BotNeckLog');
const ConfigManager = require('./ConfigManager');
const { DiscordNetwork, DiscordNetworkCleanup } = require('./DiscordNetwork');
const ModuleManager = require('./ModuleManager');
const CommandManager = require('./CommandManager');
const BotNeckClient = require('../api/BotNeckClient');
const { DiscordClientMessage } = require('../api/DiscordAPI');
const { BotNeckConfig } = require('./configParsers');

/**
 * @type {ConfigManager}
 */
let _configManager;
/**
 * @type {DiscordNetwork}
 */
let _discordNetwork;
/**
 * @type {CommandManager}
 */
let _commandManager;
/**
 * @type {ModuleManager}
 */
let _moduleManager;

module.exports = class BotNeckBot {
    constructor() {
        _configManager = new ConfigManager();
        _configManager.loadConfiguration('BotNeck')
        .then(config => {
            const parsedConfig = new BotNeckConfig(config);

            _discordNetwork = new DiscordNetwork();
            _discordNetwork.onRequestSent = (requestJson, isBotRequest) => {
                if(requestJson.content === null) return;
                BotNeckClient.onMessageSend.invoke(new DiscordClientMessage(requestJson), isBotRequest);
            }

            _commandManager = new CommandManager(parsedConfig);
            BotNeckClient.onMessageSend.addEventCallback((message, isBotRequest) => {
                if(isBotRequest) return;
                _commandManager.handleMessage(message);
            });

            _moduleManager = new ModuleManager();
            _moduleManager.loadModules();
        })
        .catch(err => BotNeckLog.error(err, 'Failed to load BotNeck configuration!'));
    }
    destroy() {
        if(_moduleManager) {
            _moduleManager.destroy();
            _moduleManager = null;
        }

        if(_commandManager) {
            _commandManager.destroy();
            _commandManager = null;
        }

        if(_discordNetwork) {
            DiscordNetworkCleanup();
            _discordNetwork = null;
        }

        if(_configManager) {
            _configManager.destroy();
            _configManager = null;
        }
    }

    static get Name() { return 'BotNeck Bot'; }
    static get Description() { return 'Adds selfbot commands to the Discord client.'; }
    static get Version() { return '3.0.0'; }
    static get Author() { return 'AtiLion'; }
}