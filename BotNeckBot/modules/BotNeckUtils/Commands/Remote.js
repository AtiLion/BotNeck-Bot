const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');
const { BotNeckParser } = require('../../../core/configParsers');

module.exports = class RemoteCommand extends BotNeckCommand {
    get Command() { return 'remote'; }
    get Description() { return 'Enables or disables remote commands for the current client'; }
    get Usage() { return 'remote [enable/disable]'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        if(BotNeckCommand.getNumberOfArguments(args) > 0) {
            let arg = args[0].toLowerCase();

            if(arg === 'enable') {
                BotNeckParser.Instance.IsMaster = true;
                BotNeckParser.Instance.save();
                return BotNeckPresets.createInfo(message, 'Enabled remote commands on the current client');
            }
            else if(arg === 'disable') {
                BotNeckParser.Instance.IsMaster = false;
                BotNeckParser.Instance.save();
                return BotNeckPresets.createInfo(message, 'Disabled remote commands on the current client');
            }
            else return BotNeckPresets.createInfo(message, 'Unknown remote command option');
        }

        if(BotNeckParser.Instance.IsMaster)
            BotNeckPresets.createInfo(message, 'Remote commands are enabled on the current client');
        else
            BotNeckPresets.createInfo(message, 'Remote commands are disabled on the current client');
    }
}