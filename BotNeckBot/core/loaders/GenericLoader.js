const BotNeckLog = require('../../api/BotNeckLog');

module.exports = class GenericLoader {
    constructor(file, module, type) {
        this.file = file;
        this.module = module;
        this.type = type;
    }

    load() {}
    unload() {}
}