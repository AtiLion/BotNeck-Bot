const { DiscordUser } = require('../DiscordAPI');

module.exports = class BotNeckAPI {
	static getCurrentServerId() { return window.location.pathname.split('/')[2]; }
	static getCurrentChannelId() { return window.location.pathname.split('/')[3]; }
	static getLastUserMessageId() { return protectedObject['lastUserMessageId']; }
	static getLastBotMessageId() { return protectedObject['lastBotMessageId']; }
	static getModulesPath() { return path.join(window.ContentManager.pluginsFolder, 'BotNeckModules'); }
	static getCurrentUser(apiKey, callback) {
		callback(DiscordUser.current);
	}
	static getTargetUser(apiKey, userId, callback) {
		callback(DiscordUser.getFromId(userId));
	}

	static setAuthHeader(req, apiKey) {
		req.escalateAuthorization = true;
		return true;
	}
	static nextMessagePost(func) {
		protectedObject['messagePostEvent'].push(func);
	}

	static generateError(error) {
		return {
			title: 'BotNeck Error',
			type: 'rich',
			description: error,
			color: 0xff6e00
		}
	}
	static getArgumentNumber(args) {
		if(typeof args !== 'object')
			return 0;
		let counter = 0;

		for(let key in args)
			if(!isNaN(key))
				counter++;
		return counter;
	}
	static getArgumentsAsString(args) {
		let input = '';

		for(let i in args)
			input += args[i] + ' ';
		return input;
	}
	static getMentionUserId(mention) {
		if(!mention.startsWith('<@!') || !mention.endsWith('>')) return null;

		return mention.substring(3, mention.length - 1);
	}
}