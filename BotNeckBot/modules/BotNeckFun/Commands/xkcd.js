const request = require('request');
const {
    BotNeckCommand,
    BotNeckPresets,
    BotNeckClient,
    BotNeckLog,
    DiscordAPI: {
        DiscordClientMessage,
        DiscordClientMessageBase
    }
} = require('../../BotNeckAPI');

module.exports = class xkcdCommand extends BotNeckCommand {
    get Command() { return 'xkcd'; }
    get Description() { return 'Gets a random comic from xkcd'; }
    get Usage() { return 'xkcd'; }

    /**
     * Gets the XKCD feed
     * @returns {Promise} Request output
     */
    getFeed() {
        return new Promise((resolve) => {
            request({ url: 'https://xkcd.com/atom.xml' }, (err, response, body) => resolve({ err, response, body }));
        });
    }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        BotNeckPresets.createInfo(message, 'Your XKCD comic is being loaded...');
        BotNeckClient.runAfterMessage(this.getFeed(), (dMessage, { err, response, body }) => {
            let replyMessage = new DiscordClientMessageBase();

            if(err || response.statusCode != 200 || !body) {
                BotNeckPresets.createError(replyMessage, 'Failed to get a proper response from xkcd feed!');
                return dMessage.editMessage(replyMessage);
            }

            let parser = new DOMParser();
            let parsedDom = parser.parseFromString(body, 'application/xml');

            if(parsedDom.documentElement.nodeName === 'parsererror') {
                BotNeckPresets.createError(replyMessage, 'Failed to parse xkcd feed!');
                return dMessage.editMessage(replyMessage);
            }

            let firstEntry = parsedDom.documentElement.querySelector('entry > id');
            if(!firstEntry) {
                BotNeckPresets.createError(replyMessage, 'Failed to find xkcd entry');
                return dMessage.editMessage(replyMessage);
            }

            let urlSplit = firstEntry.innerHTML.split('/');
            if(urlSplit.length < 3) {
                BotNeckPresets.createError(replyMessage, 'Failed to parse xkcd id!');
                return dMessage.editMessage(replyMessage);
            }

            let highestNumber = Number(urlSplit[urlSplit.length - 2]);
            if(isNaN(highestNumber)) {
                BotNeckPresets.createError(replyMessage, 'Failed to parse xkcd id!');
                return dMessage.editMessage(replyMessage);
            }

            replyMessage.Content = `Here is your XKCD webcomic: https://xkcd.com/${Math.floor((Math.random() * highestNumber) + 1)}/`;
            dMessage.editMessage(replyMessage);
        });



        /*let comicnumber = BotNeckCommand.getArgumentsAsString(args);

        if (argnumber == "") {
            message.Content = `Here is your random **XKCD** webcomic page:
            https://xkcd.com/${Math.floor((Math.random() * page) + 1)}/`;
        }else{
            message.Content = `Here is your specific **XKCD** webcomic page:
            https://xkcd.com/${comicnumber}`;
        }*/
    }
}