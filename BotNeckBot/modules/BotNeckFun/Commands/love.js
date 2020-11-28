const { 
    BotNeckCommand,
    BotNeckPresets,
    BotNeckClient,
    DiscordAPI: {
        DiscordClientMessage,
        DiscordUser,
        DiscordClientMessageBase
    }
} = require('../../BotNeckAPI');

module.exports = class LoveCommand extends BotNeckCommand {
    get Command() { return 'love'; }
    get Description() { return 'Calculates the love between 2 users <3'; }
    get Usage() { return 'love <user1> [user2]'; }
    get MinimumArguments() { return 1; }

    /**
     * Converts usernames of the selected users or own user to a text
     * @param {String} user1 The user's username or mentioned user
     * @param {String} user2 The user's username or mentioned user
     * @returns {Promise<String>} The combined string of both user's usernames
     */
    convertToText(user1, user2) {
        return new Promise((resolve, reject) => {
            let text = '';
            let promise_land = [];

            if(user1.startsWith('<@!')) {
                promise_land.push(DiscordUser.getFromMention(user1)
                .then(user => {
                    text += user.Username;
                }));
            } else text += user1;

            if(user2.startsWith('<@!')) {
                promise_land.push(DiscordUser.getFromMention(user2)
                .then(user => {
                    text += user.Username;
                }));
            } else text += user2

            Promise.all(promise_land)
            .then(() => resolve(text)).catch(reject);
        });
    }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        let user1 = args[0];
        let user2 = (args[1] || DiscordUser.current.Username);

        BotNeckPresets.createInfo(message, 'Finding the love in the air...');
        BotNeckClient.runAfterMessage(this.convertToText(user1, user2), (dMessage, text) => {
            let process_num = '';
            let processed_num = '';

            process_num = (text.match(/l/gi) || []).length.toString() + (text.match(/o/gi) || []).length.toString() + (text.match(/v/gi) || []).length.toString() + (text.match(/e/gi) || []).length.toString() + (text.match(/s/gi) || []).length.toString();
            while(process_num.length > 2)
            {
                for(let i = 0; i < process_num.length - 1; i++)
                    processed_num += (Number(process_num[i]) + Number(process_num[i + 1])).toString();

                process_num = processed_num;
                processed_num = '';
            }

            if(args['cheat'])
                process_num = args['cheat'];

            let baseMessage = new DiscordClientMessageBase();
            BotNeckPresets.createBase(baseMessage, {
                Title: 'Love Calculator',
                Description: `How much do ${user1} and ${user2} love each other?`
            });
            baseMessage.Embed.addField('Result', process_num + '%');
            dMessage.editMessage(baseMessage);
        });
    }
}