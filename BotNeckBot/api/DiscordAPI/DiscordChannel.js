const WebpackModules = require('./DiscordWebpack');
const BotNeckClient = require('../BotNeckClient');

const ChannelStore = WebpackModules.getByProps('getChannel', 'getDMFromUserId');
const SelectedChannelStore = WebpackModules.getByProps('getLastSelectedChannelId');
module.exports = class DiscordChannel {
    /**
     * Creates a wrapper around the raw Discord channel object
     * @param {any} channelObject The raw Discord channel object
     */
    constructor(channelObject) {
        this.discordData = channelObject;
    }

    /**
     * Gets the ID of the selected Discord channel
     * @returns {String} The ID of the selected Discord channel
     */
    get Id() { return this.discordData.id; }

    /**
     * Creates a DiscordChannel object from a Discord channel's snowflake ID
     * @param {Number} id The snowflake ID of the Discord channel
     * @returns {Promise<DiscordChannel>} The DiscordChannel object or null if not found
     */
    static getFromId(id) {
        return new Promise((resolve, reject) => {
            const channel = ChannelStore.getChannel(id);

            if(channel) return resolve(new DiscordChannel(channel));
            if(!channel && !DiscordNetwork.Instance) return resolve(null);

            // At least try to get it via request if it isn't cached by the client
            BotNeckClient.sendAuthorizedRequest('/channels/' + id, 'GET')
            .then(channelObject => {
                if(!channelObject.id) return resolve(null);
                resolve(new DiscordChannel(channelObject));
            })
            .catch(reject);
        });
    }

    /**
     * Returns the DiscordChannel object of the current Discord guild
     * @returns {Promise<DiscordChannel>} The current guild's DiscordChannel object or null if not found
     */
    static get current() {
        return this.getFromId(SelectedChannelStore.getChannelId());
    }
}