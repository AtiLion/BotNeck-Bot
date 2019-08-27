class lmgtfy {
	constructor() {
		this.permissions = [];
		this.command = "lmgtfy";
		this.description = "Creates a lmgtfy link for people who can't google";
		this.usage = "lmgtfy [what to google]";

		this.url = "http://lmgtfy.com/?q=";
	}

	execute(message, args) {
		// Get input
		let input = "";
		for(let i in args)
			input += args[i] + " ";

		// Generate link
		message.content = this.url + encodeURI(input);
	}
}
