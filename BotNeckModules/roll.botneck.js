class roll {
	constructor() {
		this.permissions = [];
		this.command = 'roll';
		this.description = 'Rolls the dice';
		this.usage = 'roll [max value]';
	}

	execute(message, args) {
		// Init
		delete message['content'];

		// Validate number of args
		if(BotNeckAPI.getArgumentNumber(args) < 1)
			return message['embed'] = BotNeckAPI.generateError('You need at least 1 argument for this command!');
		if(isNaN(args[0]))
			return message['embed'] = BotNeckAPI.generateError('Specified argument is not a number!');

		// Execute
		let num = Math.floor(Math.random() * Number(args[0]) + 1);
		message['embed'] = {
			title: 'Roll the dice',
			type: 'rich',
			description: 'The dice rolled a ' + num + ' with the maximum value of ' + args[0],
			color: 0x0061ff,
		}
	}
}
