class love {
	constructor() {
		this.permissions = [];
		this.command = "love";
		this.description = "Calculates the love between 2 users <3";
		this.usage = "love <user1> [user2]";
	}

	execute(message, args) {
		// Init
		delete message["content"];

		// Validate number of args
		if(BotNeckAPI.getArgumentNumber(args) < 2)
			return message["embed"] = BotNeckAPI.generateError("You need at least 2 argument for this command!");

		// Setup variables
		let user1 = args[0];
		let user2 = args[1];
		let txt = user1 + user2;
		let process_num = "";
		let processed_num = "";

		// Calculate
		process_num = (txt.match(/l/gi) || []).length.toString() + (txt.match(/o/gi) || []).length.toString() + (txt.match(/v/gi) || []).length.toString() + (txt.match(/e/gi) || []).length.toString() + (txt.match(/s/gi) || []).length.toString();
		while(process_num.length > 2)
		{
			for(let i = 0; i < process_num.length - 1; i++)
				processed_num += (Number(process_num[i]) + Number(process_num[i + 1])).toString();

			process_num = processed_num;
			processed_num = "";
		}

		// Cheat
		if(args["cheat"])
			process_num = args["cheat"];

		// Display
		message["embed"] = {
			title: "Love Calculator",
			type: "rich",
			description: `How much do ${user1} and ${user2} love each other?`,
			color: 0x0061ff,
			fields: [
				{
					name: "Result",
					value: process_num + "%",
				},
			]
		};
	}
}
