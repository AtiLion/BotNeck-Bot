const { BotNeckModule, BotNeckClient, BotNeckCommand } = require('../BotNeckAPI');
const { Help, Usage } = require('./Commands');

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
        let helpCommand = new Help();
        BotNeckCommand.registerCommand(helpCommand);
        this.loadedCommands.push(helpCommand);

        let usageCommand = new Usage();
        BotNeckCommand.registerCommand(usageCommand);
        this.loadedCommands.push(usageCommand);
    }
    onUnload() {
        for(let command of this.loadedCommands)
            BotNeckCommand.unregisterCommand(command);
        this.loadedCommands = [];
    }
}