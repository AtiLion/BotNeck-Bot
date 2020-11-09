const { DiscordClientMessage } = require('./DiscordAPI');
const CommandManager = require('../core/CommandManager');

module.exports = class BotNeckCommand {
    /**
     * The command that has to be written into after the prefix to execute the command
     * @returns {String}
     */
    get Command() { return ''; }
    /**
     * The description of the command
     * @returns {String}
     */
    get Description() { return ''; }
    /**
     * The usage of the command
     * @returns {String}
     */
    get Usage() { return ''; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {}

    /**
     * Gets all of the currently registered commands
     * @returns {[BotNeckCommand]}
     */
    static get commandList() {
        return [...CommandManager.Instance.registeredCommands]; // Duplicate array
    }

    /**
     * Registers a command to the bot
     * @param {BotNeckCommand} instance The command instance to register
     */
    static registerCommand(instance) {
        CommandManager.Instance.registerCommand(instance);
    }
    /**
     * Unregister a command from the bot
     * @param {BotNeckCommand} instance The command instance to unregister
     */
    static unregisterCommand(instance) {
        CommandManager.Instance.unregisterCommand(instance);
    }
}