const { 
    BotNeckCommand,
    BotNeckModule,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class ReloadCommand extends BotNeckCommand {
    get Command() { return 'reload'; }
    get Description() { return 'Reloads all modules'; }
    get Usage() { return 'reload'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        BotNeckPresets.createInfo(message, 'All commands reloaded!');
        BotNeckModule.reloadModules();
    }
}