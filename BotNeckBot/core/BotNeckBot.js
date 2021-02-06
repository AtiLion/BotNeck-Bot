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
const { embedToContent } = require('../api/BotNeckConverter');

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
                BotNeckClient.emit('messageSend', new DiscordClientMessage(requestJson), isBotRequest);
                BotNeckClient.onMessageSend.invoke(new DiscordClientMessage(requestJson), isBotRequest);
            }
            _discordNetwork.onResponseReceived = (responseJson, isBotRequest) => {
                if(!responseJson.id || !responseJson.author) return;
                BotNeckClient.emit('messageResponse', new DiscordMessage(responseJson), isBotRequest);
                BotNeckClient.onMessageResponse.invoke(new DiscordMessage(responseJson), isBotRequest);
            }
            _discordNetwork.onWSReceived = (wsJson) => {
                if(!wsJson.d) return; // Make sure it's valid

                if(wsJson.t === 'MESSAGE_CREATE') {
                    BotNeckClient.emit('messageReceived', new DiscordMessage(wsJson.d), (wsJson.d.author && currentUser.Id === wsJson.d.author.id));
                    if(wsJson.d.author && currentUser.Id === wsJson.d.author.id)
                        BotNeckClient.onMessageReceived.invoke(new DiscordMessage(wsJson.d));
                }
                BotNeckClient.emit('websocketReceived', wsJson);
                BotNeckClient.onWebSocketReceive.invoke(wsJson);
            }

            _commandManager = new CommandManager(parsedConfig);
            BotNeckClient.on('messageSend', (message, isBotRequest) => {
                if(isBotRequest) return;
                if(_commandManager.handleMessage(message)) {
                    if(BotNeckParser.Instance.TextOnly) {
                        message.Content = embedToContent(message.Embed);
                        message.Embed = null;
                    }
                }
            });
            BotNeckClient.on('messageReceived', (message, sentByCurrentUser) => {
                if(!sentByCurrentUser) return; // Make sure it's sent by the current user
                if(!parsedConfig.IsMaster) return; // Make sure our current client is the master
                let baseMessage = new DiscordClientMessageBase();

                baseMessage.Content = message.Content;
                baseMessage.Embed = message.Embed;
                if(_commandManager.handleMessage(baseMessage)) {
                    if(baseMessage.Content === '' || !baseMessage.Content) baseMessage.Content = ' '; // Make sure we have an empty message content

                    if(BotNeckParser.Instance.TextOnly) {
                        baseMessage.Content = embedToContent(baseMessage.Embed);
                        baseMessage.Embed = null;
                    }

                    message.editMessage(baseMessage)
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
    static get Version() { return '3.0.2'; }
    static get Author() { return 'AtiLion'; }
}