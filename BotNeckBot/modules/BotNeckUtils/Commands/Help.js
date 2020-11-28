const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class HelpCommand extends BotNeckCommand {
    get Command() { return 'help'; }
    get Description() { return 'Displays all of the available commands and their descriptions'; }
    get Usage() { return 'help [command]'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {  
        // Display all commands
        if(!args[0]) {
            BotNeckPresets.createInfo(message, 'A list of commands within BotNeck Bot');

            for(let command of BotNeckCommand.commandList)
                message.Embed.addField(command.Command, command.Description, false);
            return;
        }

        // Show specified command information
        let potentialCommands = BotNeckCommand.commandList.filter(command => command.Command.toLowerCase() === args[0].toLowerCase());
        if(potentialCommands.length < 1)
            return BotNeckPresets.createError(message, 'Specified command not found!');

        if(potentialCommands.length === 1) {
            BotNeckPresets.createInfo(message, potentialCommands[0].Description);
            message.Embed.addField('Usage', potentialCommands[0].Usage, false);
            return;
        }
        BotNeckPresets.createInfo(message, 'List of descriptions and commands that match the search');
        for(let command of potentialCommands)
            message.Embed.addField(command.Command, command.Description, false);
    }
}