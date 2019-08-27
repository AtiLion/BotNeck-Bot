class choose {
	constructor() {
		this.permissions = [];
		this.command = "choose";
		this.description = "Randomly choose an answer";
		this.usage = "choose [answer1, answer2, answer3, ...]";
	}

	execute(message, args) {
		// Get input
		let input = "";
		for(let i in args)
			input += args[i] + " ";

		// Get choices
		let choices = input.split(",");

		// Execute
		message["embed"] = {
			title: "Random Chooser",
			type: "rich",
			description: "I choose: " + choices[Math.floor(Math.random() * choices.length)].trim(),
			color: 0x0061ff,
			fields: [
				{
					name: "Choices",
					value: input,
				}
			]
		}
		delete message["content"];
	}
}
