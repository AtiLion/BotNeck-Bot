var roll = function() {};

roll.prototype.command = "roll";
roll.prototype.minArgs = 1;
roll.prototype.help = "Rolls the dice. Usage: roll <max value>";

roll.prototype.execute = function(msg, args)
{
	if(isNaN(args[0]))
	{
		msg.content = "Invalid number!";
		return;
	}

	let num = Math.floor(Math.random() * Number(args[0]) + 1);
	let emb = {
		title: "Roll the dice",
		type: "rich",
		description: "The dice rolled a " + num + " with the maximum value of " + args[0],
		color: 0x0061ff,
	}

	delete msg["content"];
	msg["embed"] = emb;
}
