const { 
    BotNeckCommand,
    DiscordAPI: {
        DiscordEmbed,
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');
const Config = require('../config');

module.exports = class EmbedCommand extends BotNeckCommand {
    get Command() { return 'embed'; }
    get Description() { return 'Creates and sends an embed based on parameters'; }
    get Usage() { return 'embed description=\'desc\' color=0x0061ff footer.text=\'Footer\' field.name1=\'value1\''; }

    get DefaultEmbed() {
        return {
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
		};
    }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        message.Content = '';
        
        let embed = this.DefaultEmbed;
        if(args['load'] && Config.Instance.SavedEmbeds[args['load']])
            embed = JSON.parse(JSON.stringify(Config.Instance.SavedEmbeds[args['load']]));
		
		let temp = BotNeckCommand.getArgumentsAsString(args);
		if(temp && temp.length) embed.description = temp;
		for(let key in args) {
            if(!isNaN(key)) continue;
            if(key === 'load' || key === 'save') continue;

			let keySteps = key.split('.');

			if(keySteps[0] === 'fields') continue;
            if(keySteps[0] === 'type') continue;

			if(keySteps[0] !== 'field') {
                let lastObj = embed;
				for(let i = 0; i < keySteps.length; i++) {
					let keyStep = keySteps[i];

					if(i + 1 >= keySteps.length) {
						if(args[key])
							lastObj[keyStep] = args[key];
						else
							delete lastObj[keyStep];
						break;
					}

					let targetObj = lastObj[keyStep];
					if(!targetObj) lastObj[keyStep] = targetObj = {};
					lastObj = targetObj;
				}
            }
            else {
				let field = {
					name: keySteps[1],
					value: args[key],
					inline: true
				}

				embed.fields.push(field);
			}
		}
		if(embed.timestamp) {
			if(embed.timestamp == 'now')
				embed.timestamp = new Date().toISOString();
			else if(embed.timestamp != '')
				embed.timestamp = new Date(embed.timestamp).toISOString();
        }
        
        if(args['save']) {
            Config.Instance.SavedEmbeds[args['save']] = embed;
            Config.Instance.save();
        }
        message.Embed = new DiscordEmbed(embed);
    }
}