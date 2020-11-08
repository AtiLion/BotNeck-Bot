const BotNeckLog = require('../api/BotNeckLog');
const ConfigManager = require('./ConfigManager');
const { DiscordNetwork, DiscordNetworkCleanup } = require('./DiscordNetwork');
const ModuleManager = require('./ModuleManager');
const CommandManager = require('./CommandManager');
const BotNeckClient = require('../api/BotNeckClient');
const { DiscordClientMessage } = require('../api/DiscordAPI/DiscordMessage');

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
            _discordNetwork = new DiscordNetwork();
            _discordNetwork.onRequestSent = (requestJson, isBotRequest) => {
                if(requestJson.content === null) return;
                BotNeckClient.onMessageSend.invoke(new DiscordClientMessage(requestJson), isBotRequest);
            }

            _commandManager = new CommandManager(config);
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
            BotNeckLog.log('Cleaning up ModuleManager ...');
            _moduleManager.destroy();
            delete _moduleManager;
        }

        if(_commandManager) {
            BotNeckLog.log('Cleaning up CommandManager ...');
            _commandManager.destroy();
            delete _commandManager;
        }

        if(_discordNetwork) {
            BotNeckLog.log('Cleaning up DiscordNetwork ...');
            DiscordNetworkCleanup();
            delete _discordNetwork;
        }

        if(_configManager) {
            BotNeckLog.log('Cleaning up ConfigManager ...');
            _configManager.destroy();
            delete _configManager;
        }
    }

    static get Name() { return 'BotNeck Bot'; }
    static get Description() { return 'Adds selfbot commands to the Discord client.'; }
    static get Version() { return '3.0.0'; }
    static get Author() { return 'AtiLion'; }
}