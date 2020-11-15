const WebpackModules = require('./DiscordWebpack');
const BotNeckClient = require('../BotNeckClient');
const BotNeckLog = require('../BotNeckLog');

const UserStore = WebpackModules.getByProps('getCurrentUser');
module.exports = class DiscordUser {
    /**
     * Creates a wrapper around the raw Discord user object
     * @param {any} userObject The raw Discord user object
     */
    constructor(userObject) {
        this.discordData = userObject;
    }

    /**
     * Gets the ID of the selected Discord user
     * @returns {String} The ID of the selected Discord user
     */
    get Id() { return this.discordData.id; }

    /**
     * Creates a DiscordUser object from a Discord user's snowflake ID
     * @param {Number} id The snowflake ID of the Discord user
     * @returns {Promise<DiscordUser>} The DiscordUser object or null if not found
     */
    static getFromId(id) {
        return new Promise((resolve, reject) => {
            const user = UserStore.getUser(id);

            if(user) return resolve(new DiscordUser(user));
            if(!user && !DiscordNetwork.Instance) return resolve(null);

            // At least try to get it via request if it isn't cached by the client
            BotNeckClient.sendAuthorizedRequest('/users/' + id, 'GET')
            .then(userObject => {
                if(!userObject.id) return resolve(null);
                resolve(new DiscordUser(userObject));
            })
            .catch(reject);
        });
    }

    /**
     * Returns the DiscordUser object of the current Discord user
     * @returns {DiscordUser} The current user's DiscordUser object or null if not found
     */
    static get current() {
        const user = UserStore.getCurrentUser();
        return (user ? new DiscordUser(user) : null);
    }
}