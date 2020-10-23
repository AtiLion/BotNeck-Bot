let _instance = null;
module.exports = class CommandManager {
    /**
     * Creates the CommandManager to easily work with commands
     */
    constructor() {
    }

    /**
     * Gets the main instance of the CommandManager
     * @returns {CommandManager} The instance of the command manager
     */
    static get Instance() { return _instance; }
}