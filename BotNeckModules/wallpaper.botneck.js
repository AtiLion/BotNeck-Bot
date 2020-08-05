const request = require('request');

class wallpaper {
	constructor() {
		this.permissions = [ 'authorized_request' ];
        this.command = 'wallpaper';
		this.description = 'Find the perfect anime wallpaper [NSFW]';
		this.usage = 'wallpaper';
    }
    
    errorMessage(id, message) {
		$.ajax({
            type: 'PATCH',
            url: 'https://discordapp.com/api/v6/channels/' + BotNeckAPI.getCurrentChannelId() + '/messages/' + id,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                embed: BotNeckAPI.generateError(message)
            }),
            beforeSend: function(xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function(data) {},
        });
    }
    sendWallpaper(id, embed) {
        $.ajax({
            type: 'PATCH',
            url: 'https://discordapp.com/api/v6/channels/' + BotNeckAPI.getCurrentChannelId() + '/messages/' + id,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                embed
            }),
            beforeSend: function(xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function(data) {},
        });
    }

	execute(message, args) {
        let messageId = null;
        let afterMessageInvoke = null;
        let embed = {
            title: 'Wallpaper',
            type: 'rich',
            color: 0x0061ff,
            description: 'Loading please wait...'
        }

        // Create function to handle message IDs
        function runOnMessageId(func) {
            if(!messageId) afterMessageInvoke = func;
            else func();
        }

        // Make sure to get the message id
        BotNeckAPI.nextMessagePost(() => {
            messageId = BotNeckAPI.getLastUserMessageId();

            if(afterMessageInvoke)
                afterMessageInvoke();
        });

        // Send request to nekos.life
        request({ url: 'https://nekos.life/api/v2/img/wallpaper', json: true }, (error, response, body) => {
            if(error || response.statusCode != 200 || !body.url)
                return runOnMessageId(() => { this.errorMessage(messageId, 'Failed to get a proper response from nekos.life'); });
            
            // Change embed
            delete embed.description;
            embed.image = {
                url: body.url
            }

            // Send new embed
            runOnMessageId(() => { this.sendWallpaper(messageId, embed); });
        });

        // Create default/loading message
        delete message['content'];
        message['embed'] = embed;
	}
}
