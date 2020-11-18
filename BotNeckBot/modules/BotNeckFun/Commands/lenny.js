const { 
    BotNeckCommand,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class LennyCommand extends BotNeckCommand {
    get Command() { return 'lenny'; }
    get Description() { return 'Displays a lenny face'; }
    get Usage() { return 'lenny'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        message.Content = '( ͡° ͜ʖ ͡°)';
    }
}