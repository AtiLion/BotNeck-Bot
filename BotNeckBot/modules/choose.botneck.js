class choose {
	constructor() {
		this.permissions = [];
		this.command = 'choose';
		this.description = 'Randomly choose an answer';
		this.usage = 'choose [answer1, answer2, answer3, ...]';
	}

	execute(message, args) {
		// Init
		delete message['content'];

		// Validate number of args
		if(BotNeckAPI.getArgumentNumber(args) < 2)
			return message['embed'] = BotNeckAPI.generateError('You need at least 2 arguments for this command!');

		// Setup inputs
		let input = BotNeckAPI.getArgumentsAsString(args);
		let choices = input.split(',');

		// Execute
		message['embed'] = {
			title: 'Random Chooser',
			type: 'rich',
			description: 'I choose: ' + choices[Math.floor(Math.random() * choices.length)].trim(),
			color: 0x0061ff,
			fields: [
				{
					name: 'Choices',
					value: input,
				}
			]
		}
	}
}
