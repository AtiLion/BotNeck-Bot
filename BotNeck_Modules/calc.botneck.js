class calc {
	constructor() {
		this.permissions = [];
		this.command = "calc";
		this.description = "This will calculate anything for you";
		this.usage = "calc [calculation]";
	}

	execute(message, args) {
		let formula = "";

		for(let i in args)
			formula += args[i] + " ";

		message["embed"] = {
			title: "Calculator",
			type: "rich",
			description: "",
			color: 0x0061ff,
			fields: [
				{
					name: "Calculation",
					value: formula,
				},
				{
					name: "Result",
					value: eval(formula),
				},
			]
		}
		delete message["content"];
	}
}
