const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');
const { BotNeckParser } = require('../../../core/configParsers');

module.exports = class TextOnlyCommand extends BotNeckCommand {
    get Command() { return 'textOnly'; }
    get Description() { return 'Enables or disables text only mode for the current client'; }
    get Usage() { return 'textOnly [enable/disable]'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        if(BotNeckCommand.getNumberOfArguments(args) > 0) {
            let arg = args[0].toLowerCase();

            if(arg === 'enable') {
                BotNeckParser.Instance.TextOnly = true;
                BotNeckParser.Instance.save();
                return BotNeckPresets.createInfo(message, 'Enabled text only mode for the current client');
            }
            else if(arg === 'disable') {
                BotNeckParser.Instance.TextOnly = false;
                BotNeckParser.Instance.save();
                return BotNeckPresets.createInfo(message, 'Disabled text only mode for the current client');
            }
            else return BotNeckPresets.createInfo(message, 'Unknown text only command option');
        }

        if(BotNeckParser.Instance.TextOnly)
            BotNeckPresets.createInfo(message, 'Text only mode is enabled on the current client');
        else
            BotNeckPresets.createInfo(message, 'Text only mode is disabled on the current client');
    }
}