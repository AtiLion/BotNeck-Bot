class lmgtfy {
	constructor() {
		this.permissions = [];
		this.command = 'lmgtfy';
		this.description = 'Creates a lmgtfy link for people who can\'t google';
		this.usage = 'lmgtfy [what to google]';

		this.url = 'http://lmgtfy.com/?q=';
	}

	execute(message, args) {
		// Validate number of args
		if(BotNeckAPI.getArgumentNumber(args) < 1)
			return message['embed'] = BotNeckAPI.generateError('You need at least 1 argument for this command!');

		// Generate link
		message.content = this.url + encodeURI(BotNeckAPI.getArgumentsAsString(args));
	}
}
