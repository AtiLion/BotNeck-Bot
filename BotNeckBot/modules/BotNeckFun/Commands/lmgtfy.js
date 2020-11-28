const { 
    BotNeckCommand,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class LmgtfyCommand extends BotNeckCommand {
    get Command() { return 'lmgtfy'; }
    get Description() { return 'Creates a lmgtfy link for people who can\'t google'; }
    get Usage() { return 'lmgtfy <what to google>'; }
    get MinimumArguments() { return 1; }

    get Url() { return 'http://lmgtfy.com/?q='; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        message.Content = this.Url + encodeURIComponent(BotNeckCommand.getArgumentsAsString(args));
    }
}