const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');
const { BotNeckParser } = require('../../../core/configParsers');

module.exports = class ReloadConfigCommand extends BotNeckCommand {
    get Command() { return 'reloadConfig'; }
    get Description() { return 'Reload BotNeck configuration'; }
    get Usage() { return 'reloadConfig'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        if(!BotNeckParser.Instance) return BotNeckPresets.createError(message, 'Failed to find BotNeck configuration instance');
        
        BotNeckParser.Instance.reload();
        BotNeckPresets.createInfo(message, 'BotNeck configuration reloaded!');
        /*BotNeckPresets.createInfo(message, 'List of BotNeck configurations');
        message.Embed.addField('Prefix', 'The prefix used by the bot to determine what is a command');
        message.Embed.addField('ErrorOnCommandNotFound', 'Should an error embed be displayed if the given command is not found');
        message.Embed.addField('ErrorOnNotEnoughArguments', 'Should an error embed be displayed if the given command was not given enough arguments');
        message.Embed.addField('IsMaster', 'Is the current Discord client the master (used for handling remote commands)');*/
    }
}