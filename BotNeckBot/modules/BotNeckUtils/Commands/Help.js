const { 
    BotNeckCommand,
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
        message.Content = '';
        message.Embed.Title = 'BotNeck Help';
        message.Embed.Color = 0x0061ff;
        
        // Display all commands
        if(!args[0]) {
            message.Embed.Description = 'A list of commands within BotNeck Bot';

            for(let command of BotNeckCommand.commandList)
                message.Embed.addField(command.Command, command.Description, false);
            return;
        }

        // Show specified command information
        let potentialCommands = BotNeckCommand.commandList.filter(command => command.Command.toLowerCase() === args[0].toLowerCase());
        if(potentialCommands.length < 1) {
            message.Embed.Description = 'Specified command not found!';
            message.Embed.Color = 0xff6e00;
            return;
        }

        if(potentialCommands.length === 1) {
            message.Embed.Description = potentialCommands[0].Description;
            message.Embed.addField('Usage', potentialCommands[0].Usage, false);
            return;
        }
        message.Embed.Description = 'List of descriptions and commands that match the search';
        for(let command of potentialCommands)
            message.Embed.addField(command.Command, command.Description, false);
    }
}