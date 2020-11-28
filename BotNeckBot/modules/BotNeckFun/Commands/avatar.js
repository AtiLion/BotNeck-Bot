const {
    BotNeckCommand,
    BotNeckPresets,
    BotNeckClient,
    BotNeckLog,
    DiscordAPI: {
        DiscordClientMessage,
        DiscordUser,
        DiscordClientMessageBase
    }
} = require('../../BotNeckAPI');

module.exports = class AvatarCommand extends BotNeckCommand {
    get Command() { return 'avatar'; }
    get Description() { return 'Returns the profile picture of the target user'; }
    get Usage() { return 'avatar <tagged user>'; }
    get MinimumArguments() { return 1; }
    get Aliases() { return ['av']; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        BotNeckPresets.createInfo(message, 'Loading avatar image...');
        BotNeckClient.runAfterMessage(DiscordUser.getFromMention(args[0]), (dMesssage, userObj) => {
            if(!userObj) {
                let baseMessage = new DiscordClientMessageBase();
                BotNeckPresets.createError(baseMessage, 'Failed to find selected user');
                return dMesssage.editMessage(baseMessage);
            }
            
            /**
             * @type {DiscordUser}
             */
            let user = userObj;

            // Figure out avatar url
            let avatarUrl = `https://cdn.discordapp.com/avatars/${user.Id}/${user.Avatar}`;
            let sizeSet = '?size=1024';

            // Figure out image extension
            let imgExtension = 'png';
            if(user.Avatar.startsWith('a_'))
                imgExtension = 'gif';

            // Figure out links
            let links = `[png](${avatarUrl}.png${sizeSet}) | [jpg](${avatarUrl}.jpg${sizeSet})`;
            if(imgExtension === 'gif')
                links += ` | [webp](${avatarUrl}.webp${sizeSet})`;

            // Print out user information
            let baseMessage = new DiscordClientMessageBase();
            BotNeckPresets.createBase(baseMessage, {
                Title: `Avatar for ${user.Username}#${user.Discriminator}`,
                Image: {
                    Url: `https://cdn.discordapp.com/avatars/${user.Id}/${user.Avatar}.${imgExtension}${sizeSet}`
                }
            });
            baseMessage.Embed.addField('Link as', links);
            dMesssage.editMessage(baseMessage);
        });
    }
}