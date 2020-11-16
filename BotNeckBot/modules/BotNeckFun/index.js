const { BotNeckModule, BotNeckClient, BotNeckCommand, BotNeckLog } = require('../BotNeckAPI');
const Commands = require('./Commands');

module.exports = class BotNeckFun extends BotNeckModule {
    constructor() {
        super();

        this.loadedCommands = [];
    }

    get Name() { return 'BotNeck Fun'; }
    get Description() { return 'Fun commmands for BotNeck that are just fun to use'; }
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