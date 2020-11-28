const request = require('request');
const { 
    BotNeckCommand,
    BotNeckClient,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage,
        DiscordClientMessageBase
    }
} = require('../../BotNeckAPI');

module.exports = class NekoCommand extends BotNeckCommand {
    get Command() { return 'neko'; }
    get Description() { return 'Sends a random neko image [NSFW]'; }
    get Usage() { return 'neko'; }

    /**
     * Gets a random neko image from nekos.life
     * @returns {Promise} Request output
     */
    getImage() {
        return new Promise((resolve) => {
            request({ url: 'https://nekos.life/api/v2/img/neko', json: true }, (err, response, body) => resolve({ err, response, body }));
        });
    }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        BotNeckPresets.createInfo(message, 'Finding you a neko...');
        BotNeckClient.runAfterMessage(this.getImage(), (dMessage, { err, response, body }) => {
            let replyMessage = new DiscordClientMessageBase();

            if(err || response.statusCode != 200 || !body.url) {
                BotNeckPresets.createError(replyMessage, 'Failed to get a proper response from nekos.life');
                return dMessage.editMessage(replyMessage);
            }

            BotNeckPresets.createBase(replyMessage, {
                Title: 'Neko finder',
                Image: {
                    Url: body.url
                }
            });
            dMessage.editMessage(replyMessage);
        });
    }
}