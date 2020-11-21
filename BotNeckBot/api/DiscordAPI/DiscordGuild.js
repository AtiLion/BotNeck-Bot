const WebpackModules = require('./DiscordWebpack');
const BotNeckClient = require('../BotNeckClient');

const GuildStore = WebpackModules.getByProps('getGuild');
const SelectedGuildStore = WebpackModules.getByProps('getLastSelectedGuildId');
module.exports = class DiscordGuild {
    /**
     * Creates a wrapper around the raw Discord guild object
     * @param {any} guildObject The raw Discord guild object
     */
    constructor(guildObject) {
        this.discordData = guildObject;
    }

    /**
     * Gets the ID of the selected Discord guild
     * @returns {String} The ID of the selected Discord guild
     */
    get Id() { return this.discordData.id; }

    /**
     * Creates a DiscordGuild object from a Discord guild's snowflake ID
     * @param {Number} id The snowflake ID of the Discord guild
     * @returns {Promise<DiscordGuild>} The DiscordGuild object or null if not found
     */
    static getFromId(id) {
        return new Promise((resolve, reject) => {
            const guild = GuildStore.getGuild(id);

            if(guild) return resolve(new DiscordGuild(guild));
            if(!guild && !DiscordNetwork.Instance) return resolve(null);

            // At least try to get it via request if it isn't cached by the client
            BotNeckClient.sendAuthorizedRequest('/guilds/' + id, 'GET')
            .then(guildObject => {
                if(!guildObject.id) return resolve(null);
                resolve(new DiscordGuild(guildObject));
            })
            .catch(reject);
        });
    }

    /**
     * Returns the DiscordGuild object of the current Discord guild
     * @returns {Promise<DiscordGuild>} The current guild's DiscordGuild object or null if not found
     */
    static get current() {
        return this.getFromId(SelectedGuildStore.getGuildId());
    }
}