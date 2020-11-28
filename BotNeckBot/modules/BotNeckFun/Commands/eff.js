const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage,
        DiscordUser
    }
} = require('../../BotNeckAPI');

module.exports = class EffCommand extends BotNeckCommand {
    get Command() { return 'f'; }
    get Description() { return 'Press F to pay respects'; }
    get Usage() { return 'f [person/thing]'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        let user = DiscordUser.current;
        if(BotNeckCommand.getNumberOfArguments(args))
            message.Content = `**${user.Username}** has paid their respect for **${BotNeckCommand.getArgumentsAsString(args)}**`;
        else
            message.Content = `**${user.Username}** has paid their respect`;
    }
}