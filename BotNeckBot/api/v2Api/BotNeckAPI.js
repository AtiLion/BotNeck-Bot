const { DiscordUser } = require('../DiscordAPI');
const BotNeckLog = require('../BotNeckLog');
const BotNeckCommand = require('../BotNeckCommand');
const BotNeckClient = require('../BotNeckClient');
const BotNeckModule = require('../BotNeckModule');

module.exports = class BotNeckAPI {
	static getCurrentServerId() { return window.location.pathname.split('/')[2]; }
	static getCurrentChannelId() { return window.location.pathname.split('/')[3]; }
	static getLastUserMessageId() { return BotNeckClient.getLastUserMessage().Id; }
	static getLastBotMessageId() { return BotNeckClient.getLastBotMessage().Id; }
	static getModulesPath() { return BotNeckModule.modulesPath; }
	static getCurrentUser(apiKey, callback) {
		callback(DiscordUser.current);
	}
	static getTargetUser(apiKey, userId, callback) {
		DiscordUser.getFromId(userId)
		.then(user => callback(user.discordData))
		.catch(err => { BotNeckLog.error(err, 'Failed to get target user!'); callback(null); })
	}

	static setAuthHeader(req, apiKey) {
		req.escalateAuthorization = true;
		return true;
	}
	static nextMessagePost(func) {
		BotNeckClient.onMessageSend.callbackOnce(() => {
			try { func(); }
			catch (err) { BotNeckLog.error(err, 'Failed to invoke message post function!'); }
		});
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
		return BotNeckCommand.getNumberOfArguments(args);
	}
	static getArgumentsAsString(args) {
		return BotNeckCommand.getArgumentsAsString(args);
	}
	static getMentionUserId(mention) {
		if(!mention.startsWith('<@!') || !mention.endsWith('>')) return null;

		return mention.substring(3, mention.length - 1);
	}
}