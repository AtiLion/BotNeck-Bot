class embed {
	constructor() {
		this.permissions = [];
		this.command = 'embed';
		this.description = 'Creates and sends an embed based on parameters';
		this.usage = 'embed description=\'desc\' color=0x0061ff footer.text=\'Footer\' field.name1=\'value1\'';
	}

	execute(message, args) {
		// Remove content
		delete message['content'];

		// Create default embed
		let embed = {
			title: 'BotNeck Embed',
		    type: 'rich',
		    description: 'This message is from the BotNeck Bot!',
		    color: 0x0061ff,
		    url: 'https://github.com/AtiLion/BotNeck-Bot',
		    timestamp: 'now',
		    footer: {
		      text: 'Powered by BotNeck Bot',
		      icon_url: '',
		    },
		    author: {
		      name: 'AtiLion',
		      url: 'https://github.com/AtiLion',
		      icon_url: 'https://avatars3.githubusercontent.com/u/20825809?s=460&v=4',
		    },
		    fields: []
		}

		// Parse the args
		for(let key in args) {
			// Only look for keys
			if(!isNaN(key)) continue;

			// Split key
			let keySteps = key.split('.');

			// Blacklist
			if(keySteps[0] === 'fields') continue;
			if(keySteps[0] === 'type') continue;

			// Check for fields
			if(keySteps[0] !== 'field') {
				// Build key step object
				let lastObj = embed;
				for(let i = 0; i < keySteps.length; i++) {
					// Get step
					let keyStep = keySteps[i];

					// Last key step
					if(i + 1 >= keySteps.length) {
						if(args[key])
							lastObj[keyStep] = args[key];
						else
							delete lastObj[keyStep];
						break;
					}

					// Move into
					let targetObj = lastObj[keyStep];
					if(!targetObj) lastObj[keyStep] = targetObj = {};
					lastObj = targetObj;
				}
			} else {
				let field = {
					name: keySteps[1].replace('_', ' '),
					value: args[key],
					inline: true
				}

				embed.fields.push(field);
			}
		}

		// Fix timestamp
		if(embed.timestamp) {
			if(embed.timestamp == 'now')
				embed.timestamp = new Date().toISOString();
			else if(embed.timestamp != '')
				embed.timestamp = new Date(embed.timestamp).toISOString();
		}

		// Print out
		message['embed'] = embed;
	}
}
