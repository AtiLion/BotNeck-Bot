const BotNeckEvent = require('./BotNeckEvent');
const { DiscordNetwork } = require('../core/DiscordNetwork');

const _onMessageSend = new BotNeckEvent();
const _onMessageReceived = new BotNeckEvent();

module.exports = {
    onMessageSend = _onMessageSend,

    /**
     * Sends an unauthorized request to Discord's API with the specified data
     * @param {String} endpoint The endpoint in Discord's API to send the request to
     * @param {String} type The type of request to send (GET, SET, ...)
     * @param {any} jsonData The JSON data to send along with the request
     * @returns {Promise<any>} The JSON object that gets returned from Discord's API
     */
    sendRequest(endpoint, type, jsonData = null) {
        DiscordNetwork.Instance.sendRequest(endpoint, type, jsonData);
    },
    /**
     * Sends an authorized request to Discord's API with the specified data
     * @param {String} endpoint The endpoint in Discord's API to send the request to
     * @param {String} type The type of request to send (GET, SET, ...)
     * @param {any} jsonData The JSON data to send along with the request
     * @returns {Promise<any>} The JSON object that gets returned from Discord's API
     */
    sendAuthorizedRequest(endpoint, type, jsonData = null) {
        DiscordNetwork.Instance.sendAuthorizedRequest(endpoint, type, jsonData);
    }
}