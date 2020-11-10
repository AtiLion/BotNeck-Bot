const { 
    BotNeckCommand,
    DiscordAPI: {
        DiscordClientMessage,
        DiscordEmbed
    }
} = require('../../BotNeckAPI');

module.exports = class UsageCommand extends BotNeckCommand {
    get Command() { return 'usage'; }
    get Description() { return 'Displays the specified command usage'; }
    get Usage() { return 'usage <command>'; }
    get MinimumArguments() { return 1; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        message.Content = '';
        message.Embed.Title = 'BotNeck Usage';
        message.Embed.Color = 0x0061ff;

        let potentialCommands = BotNeckCommand.commandList.filter(command => command.Command.toLowerCase() === args[0].toLowerCase());
        if(potentialCommands.length < 1) {
            message.Embed.Description = 'Specified command not found!';
            message.Embed.Color = 0xff6e00;
            return;
        }

        if(potentialCommands.length === 1) {
            message.Embed.Description = potentialCommands[0].Usage;
            return;
        }
        message.Embed.Description = 'List of usages and commands that match the search';
        for(let command of potentialCommands)
            message.Embed.addField(command.Command, command.Usage, false);
    }
}