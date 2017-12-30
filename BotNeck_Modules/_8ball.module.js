var _8ball = function() {};

_8ball.answers = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];

_8ball.prototype.command = "8ball";
_8ball.prototype.minArgs = 1;
_8ball.prototype.help = "The magic 8ball will answer any of your questions(as long as they are a yes or no question). Usage: 8ball <question>";

_8ball.prototype.execute = function(msg, args)
{
	let emb = {
		title: "Magic 8Ball",
		type: "rich",
		description: "",
		color: 0x0061ff,
		fields: [
			{
				name: "Question",
				value: args.join(" "),
			},
			{
				name: "Answer",
				value: _8ball.answers[Math.floor(Math.random() * _8ball.answers.length)],
			},
		],
	};

	delete msg["content"];
	msg["embed"] = emb;
}
