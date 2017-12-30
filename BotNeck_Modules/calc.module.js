var calc = function() {};

calc.prototype.command = "calc";
calc.prototype.minArgs = 1;
calc.prototype.help = "This will calculate anything for you. Usage: calc <calculation>";

calc.prototype.execute = function(msg, args)
{
	let emb = {
		title: "Calculator",
		type: "rich",
		description: "",
		color: 0x0061ff,
		fields: [
			{
				name: "Calculation",
				value: args.join(" "),
			},
			{
				name: "Result",
				value: eval(args.join("")),
			},
		],
	}

	delete msg["content"];
	msg["embed"] = emb;
}
