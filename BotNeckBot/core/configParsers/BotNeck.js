module.exports = class BotNeckConfig {
    /**
     * Creates a BotNeck config wrapper for the specified JSON
     * @param {any} configObject The raw config JSON to wrap around
     */
    constructor(configObject) {
        this.config = configObject;
    }

    /**
     * The prefix used to specify what is a command
     * @returns {String}
     */
    get Prefix() { return this.config.prefix; }
    /**
     * The prefix used to specify what is a command
     * @param {String} prefix
     */
    set Prefix(prefix) { this.config.prefix = prefix; }

    /**
     * Should an error be displayed if a command is not found
     * @returns {Boolean}
     */
    get ErrorOnCommandNotFound() { return this.config.errorOnCommandNotFound; }
    /**
     * Should an error be displayed if a command is not found
     * @param {Boolean} errorOnCommandNotFound
     */
    set ErrorOnCommandNotFound(errorOnCommandNotFound) { this.config.errorOnCommandNotFound = errorOnCommandNotFound; }

    /**
     * Should an error be displayed if not enough arguments were provided to the command
     * @returns {Boolean}
     */
    get ErrorOnNotEnoughArguments() { return this.config.errorOnNotEnoughArguments; }
    /**
     * Should an error be displayed if not enough arguments were provided to the command
     * @returns {Boolean}
     */
    set ErrorOnNotEnoughArguments(errorOnNotEnoughArguments) { this.config.errorOnNotEnoughArguments = errorOnNotEnoughArguments; }
}