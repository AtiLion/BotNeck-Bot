const BotNeckLog = require('../api/BotNeckLog');
const { DiscordNetwork, DiscordNetworkCleanup } = require('./DiscordNetwork');

module.exports = class BotNeckBot {
    constructor() {
        this.discordNetwork = new DiscordNetwork();

        this.discordNetwork.onRequestSent = (data, isBot) => {
            if(isBot) BotNeckLog.log('Got bot request data', data);
            else BotNeckLog.log('Got discord request data', data);
        }
        this.discordNetwork.onResponseReceived = (data, isBot) => {
            if(isBot) BotNeckLog.log('Got bot response data', data);
            else BotNeckLog.log('Got discord response data', data);
        }
    }
    destroy() {
        BotNeckLog.log('Cleaning up DiscordNetwork ...');
        DiscordNetworkCleanup();
        delete this.discordNetwork;
    }

    static get Name() { return 'BotNeck Bot'; }
    static get Description() { return 'Adds selfbot commands to the Discord client.'; }
    static get Version() { return '3.0.0'; }
    static get Author() { return 'AtiLion'; }
}