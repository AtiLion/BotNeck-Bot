//META{"name":"BotNeck","website":"https://github.com/AtiLion/BotNeck-Bot","source":"https://github.com/AtiLion/BotNeck-Bot"}*//
const { BotNeckBot } = require('./BotNeckBot');

let BotInstance = null;

class BotNeck {
    getName() { return BotNeckBot.Name; }
    getDescription() { return BotNeckBot.Description; }
    getVersion() { return BotNeckBot.Version; }
    getAuthor() { return BotNeckBot.Author; }

    load() {
    }
    
    start() {
        BotInstance = new BotNeckBot();
    }
    stop() {
        BotInstance.destroy();
    }
}