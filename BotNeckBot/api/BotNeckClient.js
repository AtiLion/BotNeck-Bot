const BotNeckEvent = require('./BotNeckEvent');
const { DiscordNetwork } = require('../core/DiscordNetwork');
const BotNeckBot = require('../core/BotNeckBot');
const { DiscordMessage } = require('./DiscordAPI');
const BotNeckLog = require('./BotNeckLog');

const _onMessageSend = new BotNeckEvent();
const _onMessageResponse = new BotNeckEvent();
const _onMessageReceived = new BotNeckEvent();
const _onWebSocketReceive = new BotNeckEvent();

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
     * The version of the bot currently running
     * @type {String}
     */
    botVersion: BotNeckBot.Version,

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
    runAfterMessage: function(forwardPromise, ...funcs) {
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
    },

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