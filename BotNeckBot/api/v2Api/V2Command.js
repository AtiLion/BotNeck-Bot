const BotNeckCommand = require('../BotNeckCommand');

module.exports = class v2Command extends BotNeckCommand {
    constructor(command, description, usage, exec) {
        super();
        
        this.command = command;
        this.description = description;
        this.usage = usage;

        this.exec = exec;
    }

    get Command() { return this.command; }
    get Description() { return this.description; }
    get Usage() { return this.usage; }

    execute(message, args) { this.exec(message.message, args); }
}