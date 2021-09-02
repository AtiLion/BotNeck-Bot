const { DiscordClientMessageBase, DiscordEmbed } = require('../api/DiscordAPI');
const { BotNeckParser } = require('./configParsers');
const BotNeckLog = require('../api/BotNeckLog');
const BotNeckCommand = require('../api/BotNeckCommand');
const BotNeckPresets = require('../api/BotNeckPresets');

let _instance = null;
module.exports = class CommandManager {
    /**
     * Creates the CommandManager to easily work with commands
     * @param {BotNeckParser} config The parsed configuration object for BotNeck
     */
    constructor(config) {
        if(_instance) {
            BotNeckLog.error('CommandManager instance already exists!');
            return;
        }
        _instance = this;
        
        // Setup the memory objects
        /**
         * @type {[BotNeckCommand]}
         */
        this.registeredCommands = [];

        // Get out the data from the config
        this.config = config;
    }
    destroy() {
        BotNeckLog.log('Cleaning up CommandManager ...');
        _instance = null;
    }

    /**
     * Gets the main instance of the CommandManager
     * @returns {CommandManager} The instance of the command manager
     */
    static get Instance() { return _instance; }

    /**
     * Handles the client message object to find a command
     * @param {DiscordClientMessageBase} message The message object that the client is trying to send
     */
    handleMessage(message) {
        if(!message || !message.Content) return false;
        if(!message.Content.startsWith(this.config.Prefix)) return false;
        let rawCommand = message.Content.substring(this.config.Prefix.length); // Remove the prefix
        let justCommand = rawCommand.split(' ')[0];

        // Find the correct command, parse and execute
        for(let command of this.registeredCommands) {
            if(justCommand !== command.Command && !command.Aliases.includes(justCommand)) continue;
            let commandArgs = this.parseCommand(rawCommand);

            if(command.MinimumArguments > BotNeckCommand.getNumberOfArguments(commandArgs)) {
                BotNeckLog.log('Not enough arguments for message', message.Content);

                if(!this.config.ErrorOnNotEnoughArguments) return false;
                BotNeckPresets.createError(message, 'Not enough arguments provided! Check the usage below!');
                message.Embed.addField('Command Usage', command.Usage, false);
                return true;
            }

            command.execute(message, commandArgs);
            return true;
        }

        // Handle when not found
        BotNeckLog.log('Failed to find command for message', message.Content);
        if(!this.config.ErrorOnCommandNotFound) return false;
        BotNeckPresets.createError(message, 'Failed to find specified command!');
        return true;
    }
    /**
     * Parses the raw command message and returns the arguments
     * @param {String} rawCommand The raw command message to parse
     * @returns {any} The parsed arguments in the raw command message
     */
    parseCommand(rawCommand) {
        let rawArgs = rawCommand.split(' ').slice(1).join(' '); // Make sure to remove the command
        let args = {};

        let _escaped = false;
        let _inString = '';
        let currentText = '';
        let activeKeys = [];
        let index = 0;

        function pushArg() {
            if(activeKeys.length) {
                for(let key of activeKeys)
                    args[key] = currentText;

                activeKeys = [];
                currentText = '';
                return;
            }

            if(currentText.length) {
                args[index++] = currentText;
                currentText = '';
            }
        }

        for(let char of rawArgs) {
            if(!_escaped) {
                if(char === '\\') {
                    _escaped = true;
                    continue;
                }
                else if(char === '"' || char === '\'') {
                    if(_inString === char) {
                        _inString = '';
                        continue;
                    }
                    else if(!_inString) {
                        _inString = char;
                        continue;
                    }
                }

                if(!_inString) {
                    if(char === '=') {
                        activeKeys.push(currentText);
                        currentText = '';
                        continue;
                    }
                    else if(char === ' ') {
                        pushArg();
                        continue;
                    }
                }
            }

            _escaped = false;
            currentText += char;
        }
        
        pushArg();
        return args;
    }

    /**
     * Register the command to the BotNeck bot
     * @param {BotNeckCommand} command The command object to register to the bot
     */
    registerCommand(command) {
        if(!command) return;
        if(this.registeredCommands.includes(command)) return;

        this.registeredCommands.push(command);
    }
    /**
     * Unregister the command from the BotNeck bot
     * @param {BotNeckCommand} command The command object to unregister from the bot
     */
    unregisterCommand(command) {
        if(!command) return;
        if(!this.registeredCommands.includes(command)) return;

        let index = this.registeredCommands.indexOf(command);
        this.registeredCommands.splice(index, 1);
    }
}