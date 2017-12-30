var choose = function() {};

choose.prototype.command = "choose";
choose.prototype.minArgs = 1;
choose.prototype.help = "Randomly choose an answer. Usage: choose <answer1, answer2, answer3, ...>"

choose.prototype.execute = function(msg, args)
{
	let txt = args.join("");
	let choices = txt.split(",");
	let emb = {
		title: "Random Chooser",
		type: "rich",
		description: "I choose: " + choices[Math.floor(Math.random() * choices.length)],
		color: 0x0061ff,
		fields: [
			{
				name: "Choices",
				value: txt,
			}
		]
	}

	delete msg["content"];
	msg["embed"] = emb;
}
