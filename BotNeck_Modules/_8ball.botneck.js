class _8ball {
	constructor() {
		this.permissions = [];
		this.command = "8ball";
		this.description = "The magic 8ball will answer any of your questions(as long as they are a yes or no question)";
		this.usage = "8ball [question]";

		this.answers = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
	}

	execute(message, args) {
		let question = "";

		for(let i in args)
			question += args[i] + " ";

		message["embed"] = {
			title: "Magic 8Ball",
			type: "rich",
			description: "",
			color: 0x0061ff,
			fields: [
				{
					name: "Question",
					value: question,
				},
				{
					name: "Answer",
					value: this.answers[Math.floor(Math.random() * this.answers.length)],
				},
			]
		}
		delete message["content"];
	}
}
