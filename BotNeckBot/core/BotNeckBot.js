const DiscordNetwork = require('./DiscordNetwork');

module.exports = class BotNeckBot {
    constructor() {
        this.DiscordNetwork = new DiscordNetwork();
    }

    static get Name() { return 'BotNeck Bot'; }
    static get Description() { return 'Adds selfbot commands to the Discord client.'; }
    static get Version() { return '3.0.0'; }
    static get Author() { return 'AtiLion'; }
}