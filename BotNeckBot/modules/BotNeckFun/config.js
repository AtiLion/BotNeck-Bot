const { BotNeckConfig, BotNeckLog } = require('../BotNeckAPI');

let _instance = null;
module.exports = class Config extends BotNeckConfig {
    constructor() {
        super('BotNeckFun');

        if(_instance) {
            BotNeckLog.error('Config has already been loaded!');
            return;
        }
        _instance = this;
    }

    /**
     * Returns the instance of the current module's config
     * @returns {Config} The instance of the current module's config
     */
    static get Instance() { return _instance; }

    /**
     * The object of saved embeds to load for custom embed making
     * @returns {any}
     */
    get SavedEmbeds() { return this.config.savedEmbeds = (this.config.savedEmbeds || {}); }
    set SavedEmbeds(savedEmbeds) { this.config.savedEmbeds = savedEmbeds; }
}