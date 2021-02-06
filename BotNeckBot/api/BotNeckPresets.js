const { DiscordEmbed, DiscordClientMessageBase } = require('./DiscordAPI');

module.exports = {
    /**
     * Changes a client message into an error embed
     * @param {DiscordClientMessageBase} message The client message to turn into an error embed
     */
    createError: function(message, error) {
        this.createBase(message, {
            Title: 'BotNeck Error',
            Description: error,
            Color: 0xff6e00
        });
    },
    /**
     * Changes a client message into an info embed
     * @param {DiscordClientMessageBase} message The client message to turn into an info embed
     */
    createInfo: function(message, info) {
        this.createBase(message, {
            Title: 'BotNeck Info',
            Description: info
        });
    },
    /**
     * Changes a client message into the base embed
     * @param {DiscordClientMessageBase} message The client message to turn into the base embed
     * @param {DiscordEmbed} embed What information to add to the embed
     */
    createBase: function(message, embed) {
        message.Content = '';
        message.Embed = {
            Description: '',
            Color: 0x0061ff,
            Author: {
                Name: 'BotNeck Bot',
                Url: 'https://github.com/AtiLion/BotNeck-Bot',
                IconUrl: 'https://avatars1.githubusercontent.com/u/20825809?s=460&u=04546a97a5af1295a95eb1ff7a20eb9a9f76a80d&v=4'
            },
            Timestamp: new Date()
        }
        for(let embedKey in embed)
            message.Embed[embedKey] = embed[embedKey];
    }
}