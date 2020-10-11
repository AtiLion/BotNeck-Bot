const DiscordNetwork = require('./DiscordNetwork');

module.exports = class BotNeckBot {
    constructor() {
        this.discordNetwork = new DiscordNetwork();

        this.discordNetwork.onEventReceived = function(msg) {
            console.log(msg);
        }
    }

    static get Name() { return 'BotNeck Bot'; }
    static get Description() { return 'Adds selfbot commands to the Discord client.'; }
    static get Version() { return '3.0.0'; }
    static get Author() { return 'AtiLion'; }
}