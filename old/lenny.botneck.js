class lenny {
	constructor() {
		this.permissions = [];
		this.command = 'lenny';
		this.description = 'Displays a lenny face';
		this.usage = 'lenny';
	}

	execute(message, args) {
		message.content = '( ͡° ͜ʖ ͡°)';
	}
}
