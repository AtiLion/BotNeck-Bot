const BotNeckEvent = require('./BotNeckEvent');
const { DiscordNetwork } = require('../core/DiscordNetwork');
const BotNeckBot = require('../core/BotNeckBot');
const { DiscordMessage } = require('./DiscordAPI');
const BotNeckLog = require('./BotNeckLog');
const BotNeckEvent = require('./BotNeckEvent');

const _onMessageSend = new BotNeckEvent();
const _onMessageResponse = new BotNeckEvent();
const _onMessageReceived = new BotNeckEvent();
const _onWebSocketReceive = new BotNeckEvent();
const _onCurrentMessageSent = new BotNeckEvent();

let _lastUserMessage = null;
let _lastBotMessage = null;

function handleMessageResponse(message, isBot) {
    if(isBot) _lastBotMessage = message;
    else _lastUserMessage = message;
}
function handleMessageReceive(message) {
    _lastUserMessage = message;
}

_onMessageResponse.addEventCallback(handleMessageResponse);
_onMessageReceived.addEventCallback(handleMessageReceive);
module.exports = {
    /**
     * Event triggered every time a message is sent
     * @type {BotNeckEvent}
     */
    onMessageSend: _onMessageSend,
    /**
     * Event triggered every time a message that has been sent gets a response
     * @type {BotNeckEvent}
     */
    onMessageResponse: _onMessageResponse,
    /**
     * Event triggered every time a message is received from the current user
     * @type {BotNeckEvent}
     */
    onMessageReceived: _onMessageReceived,
    /**
     * Event triggered every time a websocket packet is received
     * @type {BotNeckEvent}
     */
    onWebSocketReceive: _onWebSocketReceive,
    /**
     * Event triggered when the current message is successfully sent
     * @type {BotNeckEvent}
     */
    onCurrentMessageSent: _onCurrentMessageSent,
    /**
     * The version of the bot currently running
     * @type {String}
     */
    botVersion: BotNeckBot.Version,

    /**
     * Sends an unauthorized request to Discord's API with the specified data
     * @param {String} endpoint The endpoint in Discord's API to send the request to
     * @param {String} type The type of request to send (GET, SET, ...)
     * @param {any} jsonData The JSON data to send along with the request
     * @returns {Promise<any>} The JSON object that gets returned from Discord's API
     */
    sendRequest: function(endpoint, type, jsonData = null) {
        return DiscordNetwork.Instance.sendRequest(endpoint, type, jsonData);
    },
    /**
     * Sends an authorized request to Discord's API with the specified data
     * @param {String} endpoint The endpoint in Discord's API to send the request to
     * @param {String} type The type of request to send (GET, SET, ...)
     * @param {any} jsonData The JSON data to send along with the request
     * @returns {Promise<any>} The JSON object that gets returned from Discord's API
     */
    sendAuthorizedRequest: function(endpoint, type, jsonData = null) {
        return DiscordNetwork.Instance.sendAuthorizedRequest(endpoint, type, jsonData);
    },

    /**
     * Gets the last message the user has sent
     * @returns {DiscordMessage} Last message the user has sent
     */
    getLastUserMessage: function() { return _lastUserMessage; },
    /**
     * Gets the last message the bot has sent
     * @returns {DiscordMessage} Last message the bot has sent
     */
    getLastBotMessage: function() { return _lastBotMessage; }
}