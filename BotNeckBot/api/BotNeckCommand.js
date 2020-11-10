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
     * The minimum amount of arguments required for the command to run
     * @returns {Number}
     */
    get MinimumArguments() { return 0; }

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

    /**
     * Gets the number of arguments that were passed to the command
     * @param {any} args The arguments passed to the command
     * @returns {Number} The number of passed arguments
     */
    static getNumberOfArguments(args) {
        if(typeof args !== 'object')
			return 0;
		let counter = 0;

		for(let key in args)
			if(!isNaN(key))
				counter++;
		return counter;
    }
    /**
     * Combines all the arguments into a string
     * @param {any} args The arguments passed to the command
     * @returns {String} The combined arguments as string
     */
    static getArgumentsAsString(args) {
        let input = '';

		for(let i in args)
			input += args[i] + ' ';
		return input;
    }
}