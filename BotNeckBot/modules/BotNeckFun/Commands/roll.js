const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class RollCommand extends BotNeckCommand {
    get Command() { return 'roll'; }
    get Description() { return 'Rolls the dice'; }
    get Usage() { return 'roll <max value>'; }
    get MinimumArguments() { return 1; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        if(isNaN(args[0]))
            return BotNeckPresets.createError(message, 'Specified argument is not a number!');

        let num = Math.floor(Math.random() * Number(args[0]) + 1);
        BotNeckPresets.createBase(message, {
            Title: 'Roll the dice',
            Description: `The dice rolled a ${num} with the maximum value of ${args[0]}`
        });
    }
}