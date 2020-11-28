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
     * Gets the avatar url id of the selected Discord user
     * @returns {String} The avatar url id of the selected Discord user
     */
    get Avatar() { return this.discordData.avatar; }

    /**
     * Gets the username of the selected Discord user
     * @returns {String} The username of the selected Discord user
     */
    get Username() { return this.discordData.username; }

    /**
     * Gets the discriminator of the selected Discord user
     * @returns {String} The discriminator of the selected Discord user
     */
    get Discriminator() { return this.discordData.discriminator; }

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
     * Gets the user id out of a mention tag
     * @param {String} mention The mention string to convert to the user id
     * @returns {Promise<DiscordUser>} The DiscordUser object or null if not found
     */
    static getFromMention(mention) {
        if(!mention.startsWith('<@!') || !mention.endsWith('>')) return null;
        let userId = mention.substring(3, mention.length - 1);

        return new Promise(((resolve, reject) => {
            if(!userId || isNaN(userId)) return reject('Invalid mention string!');

            this.getFromId(userId).then(resolve).catch(reject);
        }).bind(this));
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