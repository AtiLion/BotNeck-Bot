const { DiscordClientMessage } = require('./DiscordAPI');

module.exports = {
    /**
     * Changes a client message into an error embed
     * @param {DiscordClientMessage} message The client message to turn into an error embed
     */
    createError: function(message, error) {
        message.Content = '';
        message.Embed = {
            Title: 'BotNeck Error',
            Description: error,
            Color: 0xff6e00,
            Author: {
                Name: 'BotNeck Bot',
                Url: 'https://github.com/AtiLion/BotNeck-Bot',
                IconUrl: 'https://avatars1.githubusercontent.com/u/20825809?s=460&u=04546a97a5af1295a95eb1ff7a20eb9a9f76a80d&v=4'
            },
            Timestamp: new Date()
        }
    },
    /**
     * Changes a client message into an info embed
     * @param {DiscordClientMessage} message The client message to turn into an info embed
     */
    createInfo: function(message, info) {
        message.Content = '';
        message.Embed = {
            Title: 'BotNeck Info',
            Description: info,
            Color: 0x0061ff,
            Author: {
                Name: 'BotNeck Bot',
                Url: 'https://github.com/AtiLion/BotNeck-Bot',
                IconUrl: 'https://avatars1.githubusercontent.com/u/20825809?s=460&u=04546a97a5af1295a95eb1ff7a20eb9a9f76a80d&v=4'
            },
            Timestamp: new Date()
        }
    }
}