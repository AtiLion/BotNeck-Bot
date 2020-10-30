const { DiscordClientMessage } = require('../api/DiscordAPI/DiscordMessage');

let _instance = null;
module.exports = class CommandManager {
    /**
     * Creates the CommandManager to easily work with commands
     */
    constructor() {
        if(_instance) {
            BotNeckLog.error('CommandManager instance already exists!');
            return;
        }
        _instance = this;
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
    }
}