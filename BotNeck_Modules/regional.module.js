var regional = function() {};

regional.regionals = {'a': ':regional_indicator_a:', 'b': ':regional_indicator_b:',
												'c': ':regional_indicator_c:',
												'd': ':regional_indicator_d:', 'e': ':regional_indicator_e:',
												'f': ':regional_indicator_f:',
												'g': ':regional_indicator_g:', 'h': ':regional_indicator_h:',
												'i': ':regional_indicator_i:',
												'j': ':regional_indicator_j:', 'k': ':regional_indicator_k:',
												'l': ':regional_indicator_l:',
												'm': ':regional_indicator_m:', 'n': ':regional_indicator_n:',
												'o': '\:regional_indicator_o:',
												'p': ':regional_indicator_p:', 'q': ':regional_indicator_q:',
												'r': ':regional_indicator_r:',
												's': ':regional_indicator_s:', 't': ':regional_indicator_t:',
												'u': ':regional_indicator_u:',
												'v': ':regional_indicator_v:', 'w': ':regional_indicator_w:',
												'x': ':regional_indicator_x:',
												'y': ':regional_indicator_y:', 'z': ':regional_indicator_z:',
												'0': '0⃣', '1': '1⃣', '2': '2⃣', '3': '3⃣',
												'4': '4⃣', '5': '5⃣', '6': '6⃣', '7': '7⃣', '8': '8⃣', '9': '9⃣', '!': '\u2757',
												'?': '\u2753'}

regional.prototype.command = "regional";
regional.prototype.minArgs = 1;
regional.prototype.help = "Changes all letters into regionals. Usage: regional <text>";

regional.prototype.execute = function(msg, args)
{
	let txt = args.join(" ");
	let result = "";

	for(let i = 0; i < txt.length; i++)
	{
		if(regional.regionals.hasOwnProperty(txt[i].toLowerCase()))
			result += regional.regionals[txt[i].toLowerCase()] + "\u200b";
		else
			result += txt[i];
	}

	msg.content = result;
}
