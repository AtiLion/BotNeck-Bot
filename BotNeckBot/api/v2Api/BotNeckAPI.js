module.exports = class BotNeckAPI {
	static getCurrentServerId() { return window.location.pathname.split('/')[2]; }
	static getCurrentChannelId() { return window.location.pathname.split('/')[3]; }
	static getLastUserMessageId() { return protectedObject['lastUserMessageId']; }
	static getLastBotMessageId() { return protectedObject['lastBotMessageId']; }
	static getModulesPath() { return path.join(window.ContentManager.pluginsFolder, 'BotNeckModules'); }
	static getCurrentUser(apiKey, callback) {
		if(!protectedObject['currentUser']) {
			fetch('https://discordapp.com/api/v6/users/@me', {
				method: 'GET',
				headers: {
					Authorization: protectedObject['token']
				}
			})
			.then(res => {
				res.json()
				.then(user => {
					protectedObject['currentUser'] = user;
					callback(user);
				})
				.catch(err => {
					console.log('Failed parsing user information!', err);
					callback(null);
				});
			})
			.catch(err => {
				console.log('Error while getting user information!', err);
				callback(null);
			});
			return;
		}
		return callback(protectedObject['currentUser']);
	}
	static getTargetUser(apiKey, userId, callback) {
		if(!modules[apiKey] || !modules[apiKey].permissions.includes('get_target_user_info'))
			return callback(null);

		// Get target user information
		fetch('https://discordapp.com/api/v6/users/' + userId, {
			method: 'GET',
			headers: {
				Authorization: protectedObject['token']
			}
		})
		.then(res => {
			res.json()
			.then(callback)
			.catch(err => {
				console.log('Failed parsing user information!', err);
				callback(null);
			})
		})
		.catch(err => {
			console.log('Error while getting user information!', err);
			callback(null);
		});
	}

	static setAuthHeader(req, apiKey) {
		if(!modules[apiKey] || !modules[apiKey].permissions.includes('authorized_request'))
			return false;

		req['automated'] = true;
		req.setRequestHeader('Authorization', protectedObject['token']);
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