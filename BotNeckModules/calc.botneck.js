class calc {
	constructor() {
		this.permissions = [];
		this.command = "calc";
		this.description = "This will calculate anything for you";
		this.usage = "calc [calculation]";
	}

	execute(message, args) {
		// Init
		delete message["content"];

		// Validate number of args
		if(BotNeckAPI.getArgumentNumber(args) < 1)
			return message["embed"] = BotNeckAPI.generateError("You need at least 1 argument for this command!");

		// Get input
		let input = BotNeckAPI.getArgumentsAsString(args);

		// Execute
		message["embed"] = {
			title: "Calculator",
			type: "rich",
			description: "",
			color: 0x0061ff,
			fields: [
				{
					name: "Calculation",
					value: input,
				},
				{
					name: "Result",
					value: eval(input),
				},
			]
		}
	}
}
