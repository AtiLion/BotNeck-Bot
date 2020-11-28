const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');
const { BotNeckParser } = require('../../../core/configParsers');

module.exports = class PrefixCommand extends BotNeckCommand {
    get Command() { return 'prefix'; }
    get Description() { return 'Sets or gets the current prefix for commands'; }
    get Usage() { return 'prefix [new prefix]'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        if(BotNeckCommand.getNumberOfArguments(args) > 0) {
            BotNeckParser.Instance.Prefix = args[0];
            BotNeckParser.Instance.save();
            return BotNeckPresets.createInfo(message, 'Prefix change to: ' + BotNeckParser.Instance.Prefix);
        }

        BotNeckPresets.createInfo(message, 'The current prefix is: ' + BotNeckParser.Instance.Prefix);
    }
}