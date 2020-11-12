const { DiscordClientMessage, DiscordEmbed } = require('../api/DiscordAPI');
const { BotNeckConfig } = require('./configParsers');
const BotNeckLog = require('../api/BotNeckLog');
const BotNeckCommand = require('../api/BotNeckCommand');

let _instance = null;
module.exports = class CommandManager {
    /**
     * Creates the CommandManager to easily work with commands
     * @param {BotNeckConfig} config The parsed configuration object for BotNeck
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
        this.prefix = config.Prefix;
        this.errorOnCommandNotFound = config.ErrorOnCommandNotFound;
        this.errorOnNotEnoughArguments = config.ErrorOnNotEnoughArguments;
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
     * @param {DiscordClientMessage} message The message object that the client is trying to send
     */
    handleMessage(message) {
        if(!message || !message.Content) return;
        if(!message.Content.startsWith(this.prefix)) return;
        let rawCommand = message.Content.substring(this.prefix.length); // Remove the prefix

        // Find the correct command, parse and execute
        for(let command of this.registeredCommands) {
            if(!rawCommand.startsWith(command.Command)) continue;
            let commandArgs = this.parseCommand(rawCommand);

            if(command.MinimumArguments > BotNeckCommand.getNumberOfArguments(commandArgs)) {
                BotNeckLog.log('Not enough arguments for message', message.Content);

                if(!this.errorOnNotEnoughArguments) return;
                message.Content = '';
                message.Embed.Title = 'BotNeck Error';
                message.Embed.Description = 'Not enough arguments provided! Check the usage below!';
                message.Embed.Color = 0xff6e00;
                message.Embed.addField('Command Usage', command.Usage, false);
                return;
            }

            command.execute(message, commandArgs);
            return;
        }

        // Handle when not found
        BotNeckLog.log('Failed to find command for message', message.Content);
        if(!this.errorOnCommandNotFound) return;

        message.Content = '';
        message.Embed = new DiscordEmbed();
        message.Embed.Title = 'BotNeck Error';
        message.Embed.Description = 'Failed to find specified command!';
        message.Embed.Color = 0xff6e00;
    }
    /**
     * Parses the raw command message and returns the arguments
     * @param {String} rawCommand The raw command message to parse
     * @returns {any} The parsed arguments in the raw command message
     */
    parseCommand(rawCommand) {
        let broken = rawCommand.split(' ');
        let builtArgs = broken.slice(1);
        let args = {}

        // Build args
        {
            let inValue = false;
            let name = null;
            let value = null;

            function pushArg(val) {
                if(!val || val === '') args[name] = false;
                else if(!isNaN(val)) args[name] = Number(val);
                else args[name] = val;
                
                name = null;
                value = null;
            }

            for(let arg of builtArgs) {
                if(!inValue && arg.includes('=')) { // key=value argument
                    let brokenArg = arg.split('=');
                    let builtValue = '';

                    name = brokenArg[0];
                    builtValue = arg.substring(name.length + 1);
                    if(builtValue.startsWith('"')) { // It's a string
                        if(builtValue.endsWith('"')) { // Single argument string
                            pushArg(builtValue.substring(1, builtValue.length - 1));
                            continue;
                        }

                        value = builtValue.substring(1);
                        inValue = true;
                        continue;
                    }
                    pushArg(builtValue);
                }
                else if(!inValue) { // lone argument
                    name = Object.keys(args).length;
                    if(arg.startsWith('"')) {
                        if(arg.endsWith('"')) {
                            pushArg(arg.substring(1, arg.length - 1));
                            continue;
                        }

                        value = arg.substring(1);
                        inValue = true;
                        continue;
                    }
                    pushArg(arg);
                }
                else { // In the value
                    if(arg.endsWith('"')) {
                        value += ' ' + arg.substring(0, arg.length - 1);
                        inValue = false;
                        pushArg(value);
                        continue;
                    }

                    value += ' ' + arg;
                }
            }
        }
        return args
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