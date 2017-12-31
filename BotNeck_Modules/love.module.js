var love = function() {};

love.prototype.command = "love";
love.prototype.minArgs = 2;
love.prototype.help = "Calculates the love between 2 users <3. Usage: love <user1> [user2]";

love.prototype.execute = function(msg, args)
{
	let user1 = args[0];
	let user2 = args[1];
	let txt = user1 + user2;
	let process_num = "";
	let processed_num = "";

	process_num = (txt.match(/l/gi) || []).length.toString() + (txt.match(/o/gi) || []).length.toString() + (txt.match(/v/gi) || []).length.toString() + (txt.match(/e/gi) || []).length.toString() + (txt.match(/s/gi) || []).length.toString();
	while(process_num.length > 2)
	{
		for(let i = 0; i < process_num.length - 1; i++)
			processed_num += (Number(process_num[i]) + Number(process_num[i + 1])).toString();

		process_num = processed_num;
		processed_num = "";
	}

	let emb = {
		title: "Love Calculator",
		type: "rich",
		description: "How much does " + user1 + " love " + user2 + "?",
		color: 0x0061ff,
		fields: [
			{
				name: "Result",
				value: process_num + "%",
			},
		],
	};

	delete msg["content"];
	msg["embed"] = emb;
}
