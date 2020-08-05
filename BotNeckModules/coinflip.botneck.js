class coinflip {
	constructor() {
		this.permissions = [];
		this.command = 'coinflip';
		this.description = 'Flip a coin';
		this.usage = 'coinflip';
	}

	execute(message, args) {
        delete message['content'];

        // Setup embed
        message['embed'] = {
            title: 'Coinflip',
			type: 'rich',
			description: 'Well something went wrong',
			color: 0x0061ff
        }

        // Flip the coin
        if(!(Math.floor(Math.random() * 2)))
            message.embed.description = 'Heads!';
        else
            message.embed.description = 'Tails!';
	}
}
