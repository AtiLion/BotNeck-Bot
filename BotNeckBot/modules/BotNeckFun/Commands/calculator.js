const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class CalculatorCommand extends BotNeckCommand {
    get Command() { return 'calculate'; }
    get Description() { return 'This will calculate anything for you'; }
    get Usage() { return 'calculate <calculation>'; }
    get MinimumArguments() { return 1; }
    get Aliases() { return ['calc']; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        let input = BotNeckCommand.getArgumentsAsString(args);

        BotNeckPresets.createBase(message, {
            Title: 'Calculator'
        });
        message.Embed.addField('Calculation', input);
        message.Embed.addField('Result', eval(input));
    }
}