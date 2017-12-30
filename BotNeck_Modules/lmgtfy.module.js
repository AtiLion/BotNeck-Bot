var lmgtfy = function() {};

lmgtfy.url = "http://lmgtfy.com/?q=";

lmgtfy.prototype.command = "lmgtfy";
lmgtfy.prototype.minArgs = 1;
lmgtfy.prototype.help = "Creates a lmgtfy link for people who can't google. Usage: lmgtfy <what to google>";

lmgtfy.prototype.execute = function(msg, args)
{
	let search = args.join(" ");

	msg.content = lmgtfy.url + encodeURI(search);
}
