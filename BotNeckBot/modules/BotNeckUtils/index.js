const { BotNeckModule, BotNeckClient, BotNeckCommand } = require('../BotNeckAPI');
const Commands = require('./Commands');

module.exports = class BotNeckUtils extends BotNeckModule {
    constructor() {
        super();

        this.loadedCommands = [];
    }

    get Name() { return 'BotNeck Utils'; }
    get Description() { return 'Utilities/Commands for BotNeck that are essential to functionality'; }
    get Version() { return BotNeckClient.version; }
    get Author() { return 'AtiLion'; }

    onLoad() {
        for(let commandKey in Commands) {
            let command = new Commands[commandKey]();
            BotNeckCommand.registerCommand(command);
            this.loadedCommands.push(command);
        }
    }
    onUnload() {
        for(let command of this.loadedCommands)
            BotNeckCommand.unregisterCommand(command);
        this.loadedCommands = [];
    }
}