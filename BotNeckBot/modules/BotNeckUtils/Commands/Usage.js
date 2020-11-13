const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
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
        let potentialCommands = BotNeckCommand.commandList.filter(command => command.Command.toLowerCase() === args[0].toLowerCase());
        if(potentialCommands.length < 1)
            return BotNeckPresets.createError(message, 'Specified command not found!');

        if(potentialCommands.length === 1)
            return BotNeckPresets.createInfo(message, potentialCommands[0].Usage);
        BotNeckPresets.createInfo(message, 'List of usages and commands that match the search');
        for(let command of potentialCommands)
            message.Embed.addField(command.Command, command.Usage, false);
    }
}