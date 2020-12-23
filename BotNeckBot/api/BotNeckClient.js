const BotNeckEvent = require('./BotNeckEvent');
const { DiscordNetwork } = require('../core/DiscordNetwork');
const BotNeckBot = require('../core/BotNeckBot');
const { DiscordMessage, DiscordClientMessage } = require('./DiscordAPI');
const BotNeckLog = require('./BotNeckLog');
const { EventEmitter } = require('events');

const _onMessageSend = new BotNeckEvent();
const _onMessageResponse = new BotNeckEvent();
const _onMessageReceived = new BotNeckEvent();
const _onWebSocketReceive = new BotNeckEvent();

let _lastUserMessage = null;
let _lastBotMessage = null;

_onMessageResponse.addEventCallback(handleMessageResponse);
function handleMessageResponse(message, isBot) {
    if(isBot) _lastBotMessage = message;
    else _lastUserMessage = message;
}

_onMessageReceived.addEventCallback(handleMessageReceive);
function handleMessageReceive(message) {
    _lastUserMessage = message;
}

/**
 * Main class for handling BotNeck
 * @extends {EventEmitter}
 */
class BotNeckClient extends EventEmitter {
    constructor() { super(); }

     /**
     * @deprecated Use BotNeckClient.on('messageSend', ...) instead
     */
    get onMessageSend() { return _onMessageSend; }
    /**
     * @deprecated Use BotNeckClient.on('messageResponse', ...) instead
     */
    get onMessageResponse() { return _onMessageResponse; }
    /**
     * @deprecated Use BotNeckClient.on('messageReceived', ...) instead
     */
    get onMessageReceived() { return _onMessageReceived; }
    /**
     * @deprecated Use BotNeckClient.on('websocketReceived', ...) instead
     */
    get onWebSocketReceive() { return _onWebSocketReceive; }

    /**
     * The version of the bot currently running
     * @returns {String}
     */
    get botVersion() { return BotNeckBot.Version; }

    /**
     * Gets the last message the user has sent
     * @returns {DiscordMessage} Last message the user has sent
     */
    get getLastUserMessage() { return _lastUserMessage; }
    /**
     * Gets the last message the bot has sent
     * @returns {DiscordMessage} Last message the bot has sent
     */
    get getLastBotMessage() { return _lastBotMessage; }

    /**
     * Function callback for when the message is sent
     * @callback afterMessageFunc
     * @param {DiscordMessage} message
     * @param {any} promiseOutput
     */
    /**
     * Waits for the message to be sent and for a give promise to be complete before invoking the given functions
     * @param {Promise} forwardPromise A promise that has to be completed before the functions run (null if none)
     * @param  {...afterMessageFunc} funcs The functions to execute once the promise is done and the message is sent
     */
    runAfterMessage(forwardPromise, ...funcs) {
        _onMessageResponse.callbackOnce((message, isBot) => {
            if(isBot) return;
            if(!forwardPromise) {
                for(let func of funcs) {
                    try { func(message, output); }
                    catch (err) { BotNeckLog.error(err, 'Failed to invoke given functions'); }
                }
                return;
            }

            forwardPromise.then(output => {
                for(let func of funcs) {
                    try { func(message, output); }
                    catch (err) { BotNeckLog.error(err, 'Failed to invoke given functions'); }
                }
            });
        });
    }

    /**
     * Sends an unauthorized request to Discord's API with the specified data
     * @param {String} endpoint The endpoint in Discord's API to send the request to
     * @param {String} type The type of request to send (GET, SET, ...)
     * @param {any} jsonData The JSON data to send along with the request
     * @returns {Promise<any>} The JSON object that gets returned from Discord's API
     */
    sendRequest(endpoint, type, jsonData = null) {
        return DiscordNetwork.Instance.sendRequest(endpoint, type, jsonData);
    }
    /**
     * Sends an authorized request to Discord's API with the specified data
     * @param {String} endpoint The endpoint in Discord's API to send the request to
     * @param {String} type The type of request to send (GET, SET, ...)
     * @param {any} jsonData The JSON data to send along with the request
     * @returns {Promise<any>} The JSON object that gets returned from Discord's API
     */
    sendAuthorizedRequest(endpoint, type, jsonData = null) {
        return DiscordNetwork.Instance.sendAuthorizedRequest(endpoint, type, jsonData);
    }
}
const clientInstance = new BotNeckClient();
module.exports = clientInstance;

/**
 * Event triggered every time a message is sent
 * @event BotNeckClient#messageSend
 * @param {DiscordClientMessage} message The client message that is being sent to Discord
 * @param {boolean} isBot If the message has been sent by the bot or by the user
 */
/**
 * Event triggered every time a message that has been sent gets a response
 * @event BotNeckClient#messageResponse
 * @param {DiscordMessage} message The message that has been successfully sent to Discord
 * @param {boolean} isBot If the message has been sent by the bot or by the user
 */
/**
 * Event triggered every time a message is received
 * @event BotNeckClient#messageReceived
 * @param {DiscordMessage} message The message that the client has received
 * @param {boolean} ownMessage Was the message sent by the current user
 */
/**
 * Event triggered every time a websocket packet is received
 * @event BotNeckClient#websocketReceived
 * @param {any} data The websocket data that was received from the server
 */