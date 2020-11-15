const {} = require('../modules/BotNeckAPI'); // Cache BotNeckAPI
const BotNeckLog = require('../api/BotNeckLog');
const ConfigManager = require('./ConfigManager');
const { DiscordNetwork, DiscordNetworkCleanup } = require('./DiscordNetwork');
const ModuleManager = require('./ModuleManager');
const CommandManager = require('./CommandManager');
const BotNeckClient = require('../api/BotNeckClient');
const { DiscordClientMessageBase, DiscordClientMessage, DiscordMessage, DiscordUser } = require('../api/DiscordAPI');
const { BotNeckParser } = require('./configParsers');
const BotNeckConfig = require('../api/BotNeckConfig');

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
        const currentUser = DiscordUser.current;

        _configManager = new ConfigManager();
        BotNeckConfig.create(BotNeckParser)
        .then(() => {
            const parsedConfig = BotNeckParser.Instance; // Just for the type declaration

            _discordNetwork = new DiscordNetwork();
            _discordNetwork.onRequestSent = (requestJson, isBotRequest) => {
                if(requestJson.content === null) return;
                BotNeckClient.onMessageSend.invoke(new DiscordClientMessage(requestJson), isBotRequest);
            }
            _discordNetwork.onResponseReceived = (responseJson, isBotRequest) => {
                if(!responseJson.id || !responseJson.author) return;
                BotNeckClient.onMessageResponse.invoke(new DiscordMessage(responseJson), isBotRequest);
            }
            _discordNetwork.onWSReceived = (wsJson) => {
                if(!wsJson.d || wsJson.t !== 'MESSAGE_CREATE' || !wsJson.d.author) return; // Make sure to handle only message getting
                if(currentUser.Id !== wsJson.d.author.id) return; // Make sure to only handle messages from our user
                BotNeckClient.onMessageReceived.invoke(new DiscordMessage(wsJson.d));
            }

            _commandManager = new CommandManager(parsedConfig);
            BotNeckClient.onMessageSend.addEventCallback((message, isBotRequest) => {
                if(isBotRequest) return;
                _commandManager.handleMessage(message);
            });
            BotNeckClient.onMessageReceived.addEventCallback((message) => {
                if(!parsedConfig.IsMaster) return; // Make sure our current client is the master
                let baseMessage = new DiscordClientMessageBase();

                baseMessage.Content = message.Content;
                baseMessage.Embed = message.Embed;
                if(_commandManager.handleMessage(baseMessage)) {
                    if(baseMessage.Content === '' || !baseMessage.Content) baseMessage.Content = ' '; // Make sure we have an empty message content

                    message.editMessage(baseMessage.message)
                    .then(() => BotNeckLog.log('Invoked remote message', message))
                    .catch(err => BotNeckLog.error(err, 'Failed to invoke remote message', message));
                }
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
    static get Version() { return '3.0.0 preview 2'; }
    static get Author() { return 'AtiLion'; }
}