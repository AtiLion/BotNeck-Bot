class eff {
	constructor() {
		this.permissions = [ 'get_current_user_info', 'authorized_request' ];
		this.command = "f";
		this.description = "Press F to pay respects";
		this.usage = "f <person/thing>";
    }
    sendMessage(message) {
        $.ajax({
            type: "POST",
            url: "https://discordapp.com/api/v6/channels/" + BotNeckAPI.getCurrentChannelId() + "/messages",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                embed: {
                    description: message,
                    color: 0x0061ff,
                    timestamp: new Date().toISOString()
                }
            }),
            beforeSend: function(xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function(data) {},
        });
    }

	execute(message, args) {
        BotNeckAPI.getCurrentUser(APIKey, user => {
            if(!user) return console.log('No current user found! Aborting...');

            // Send message
            if(BotNeckAPI.getArgumentNumber(args) > 0)
                this.sendMessage(`**${user.username}** has paid their respect for **${BotNeckAPI.getArgumentsAsString(args)}**`);
            else
                this.sendMessage(`**${user.username}** has paid their respect`);
        });

        message.content = 'F';
	}
}
