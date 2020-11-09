const BotNeckEvent = require('./BotNeckEvent');
const { DiscordNetwork } = require('../core/DiscordNetwork');
const BotNeckBot = require('../core/BotNeckBot');

const _onMessageSend = new BotNeckEvent();
const _onMessageReceived = new BotNeckEvent();

module.exports = {
    /**
     * Event triggered every time a message is sent by the user
     * @type {BotNeckEvent}
     */
    onMessageSend: _onMessageSend,
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
    }
}