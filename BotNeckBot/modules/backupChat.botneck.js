const path = require('path');

class backupChat {
	constructor() {
		this.permissions = [ 'authorized_request' ];
		this.command = 'backupChat';
		this.description = 'Backs up the specified amount of chat into a file';
		this.usage = 'backup [amount of messages] [file name]';
	}

	execute(message, args) {
		// Init
		delete message['content'];

		// Validate number of args
		if(BotNeckAPI.getArgumentNumber(args) < 2)
			return message['embed'] = BotNeckAPI.generateError('You need at least 2 arguments for this command!');
		if(isNaN(args[0]))
			return message['embed'] = BotNeckAPI.generateError('Specified argument is not a number!');
		if(Number(args[0]) < 0 || Number(args[0]) > 100)
			return message['embed'] = BotNeckAPI.generateError('Message number can\'t be lower than 0 and higher than 100!');

		// Backup
		$.ajax({
		    type: 'GET',
		    url: 'https://discordapp.com/api/v6/channels/' + BotNeckAPI.getCurrentChannelId() + '/messages?limit=' + args[0],
		    dataType: 'json',
		    contentType: 'application/json',
		    beforeSend: function (xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
		    success: function(data)
		    {
				let chatBackup = path.join(window.bdConfig.dataPath, 'Chat_Backup');

				if(!fs.existsSync(chatBackup))
					fs.mkdirSync(chatBackup);

				let save = '';
				for(let i in data)
				{
					if(!data[i].hasOwnProperty('content') || data[i].content == '')
						continue;
					save += data[i].author.username + '#' + data[i].author.discriminator + ': ' + data[i].content + '\n';
				}

				if(fs.existsSync(chatBackup + '/' + args[1] + '.log')) {
					fs.unlink(chatBackup + '/' + args[1] + '.log', () => { fs.writeFile(chatBackup + '/' + args[1] + '.log', save, () => {}); });
					return;
				}
				fs.writeFile(chatBackup + '/' + args[1] + '.log', save, () => {});
		    }
		});

		message['embed'] = {
			title: 'Chat Backup',
			type: 'rich',
			description: 'Chat backed up successfully!',
			color: 0x0061ff
		}
	}
}
