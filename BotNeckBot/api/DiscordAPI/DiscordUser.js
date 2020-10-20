const WebpackModules = require('./DiscordWebpack');

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
     * Creates a DiscordUser object from a Discord user's snowflake ID
     * @param {Number} id The snowflake ID of the Discord user
     * @returns {DiscordUser|null} The DiscordUser object or null if not found
     */
    static getFromId(id) {
        const user = UserStore.getUser(id);
        return (user ? new DiscordUser(user) : null);
    }

    /**
     * Returns the DiscordUser object of the current Discord user
     * @returns {DiscordUser} The current user's DiscordUser object
     */
    static get current() {
        const user = UserStore.getCurrentUser();
        return (user ? new DiscordUser(user) : null);
    }
}