const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class ChooseCommand extends BotNeckCommand {
    get Command() { return 'choose'; }
    get Description() { return 'Randomly choose an answer'; }
    get Usage() { return 'choose <answer1 answer2 answer3 ...>'; }
    get MinimumArguments() { return 2; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        let argsSize = BotNeckCommand.getNumberOfArguments(args);

        BotNeckPresets.createBase(message, {
            Title: 'Random Chooser',
            Description: 'I choose: ' + args[Math.floor(Math.random() * argsSize)].trim()
        });
        message.Embed.addField('Choices', BotNeckCommand.getArgumentsAsString(args));
    }
}