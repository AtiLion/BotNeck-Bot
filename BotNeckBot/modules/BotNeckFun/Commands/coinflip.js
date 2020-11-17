const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class CoinflipCommand extends BotNeckCommand {
    get Command() { return 'coinflip'; }
    get Description() { return 'Flip a coin'; }
    get Usage() { return 'coinflip'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        BotNeckPresets.createBase(message, {
            Title: 'Coinflip',
            Description: (!!(Math.floor(Math.random() * 2)) ? 'Heads!' : 'Tails!')
        });
    }
}