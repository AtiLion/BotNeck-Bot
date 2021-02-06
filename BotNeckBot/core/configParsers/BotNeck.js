const BotNeckConfig = require('../../api/BotNeckConfig');
const BotNeckLog = require('../../api/BotNeckLog');

let _instance = null;
module.exports = class BotNeckParser extends BotNeckConfig {
    constructor() {
        super('BotNeck');

        if(_instance) {
            BotNeckLog.error('Main config has already been loaded!');
            return;
        }
        _instance = this;

        // Set defaults
        this.TextOnly = false;
        this.Prefix = '->';
        this.ErrorOnCommandNotFound = true;
        this.ErrorOnNotEnoughArguments = true;
        this.IsMaster = false;
    }

    /**
     * Returns the main config instance of BotNeck
     * @returns {BotNeckParser} The instance of the BotNeck config
     */
    static get Instance() { return _instance; }

    /**
     * When enbaled the bot will convert embeds into text
     * @returns {Boolean}
     */
    get TextOnly() { return this.config.textOnly; }
    set TextOnly(textOnly) { this.config.textOnly = textOnly; }

    /**
     * The prefix used to specify what is a command
     * @returns {String}
     */
    get Prefix() { return this.config.prefix; }
    set Prefix(prefix) { this.config.prefix = prefix; }

    /**
     * Should an error be displayed if a command is not found
     * @returns {Boolean}
     */
    get ErrorOnCommandNotFound() { return this.config.errorOnCommandNotFound; }
    set ErrorOnCommandNotFound(errorOnCommandNotFound) { this.config.errorOnCommandNotFound = errorOnCommandNotFound; }

    /**
     * Should an error be displayed if not enough arguments were provided to the command
     * @returns {Boolean}
     */
    get ErrorOnNotEnoughArguments() { return this.config.errorOnNotEnoughArguments; }
    set ErrorOnNotEnoughArguments(errorOnNotEnoughArguments) { this.config.errorOnNotEnoughArguments = errorOnNotEnoughArguments; }

    /**
     * Is the current client the master (used for remote commands)
     * @returns {Boolean}
     */
    get IsMaster() { return this.config.isMaster; }
    set IsMaster(isMaster) { this.config.isMaster = isMaster; }
}