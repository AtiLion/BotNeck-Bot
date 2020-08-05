class regional {
	constructor() {
		this.permissions = [];
		this.command = 'regional';
		this.description = 'Changes all letters into regionals';
		this.usage = 'regional [text]';

		this.regionals = {'a': ':regional_indicator_a:', 'b': ':regional_indicator_b:',
						  'c': ':regional_indicator_c:',
						  'd': ':regional_indicator_d:', 'e': ':regional_indicator_e:',
						  'f': ':regional_indicator_f:',
						  'g': ':regional_indicator_g:', 'h': ':regional_indicator_h:',
						  'i': ':regional_indicator_i:',
						  'j': ':regional_indicator_j:', 'k': ':regional_indicator_k:',
						  'l': ':regional_indicator_l:',
						  'm': ':regional_indicator_m:', 'n': ':regional_indicator_n:',
						  'o': ':regional_indicator_o:',
						  'p': ':regional_indicator_p:', 'q': ':regional_indicator_q:',
						  'r': ':regional_indicator_r:',
						  's': ':regional_indicator_s:', 't': ':regional_indicator_t:',
						  'u': ':regional_indicator_u:',
						  'v': ':regional_indicator_v:', 'w': ':regional_indicator_w:',
						  'x': ':regional_indicator_x:',
						  'y': ':regional_indicator_y:', 'z': ':regional_indicator_z:',
						  '0': '0⃣', '1': '1⃣', '2': '2⃣', '3': '3⃣',
						  '4': '4⃣', '5': '5⃣', '6': '6⃣', '7': '7⃣', '8': '8⃣', '9': '9⃣', '!': '\u2757',
						  '?': '\u2753', ' ': '  '}

	}

	execute(message, args) {
		// Validate number of args
		if(BotNeckAPI.getArgumentNumber(args) < 1)
			return message['embed'] = BotNeckAPI.generateError('You need at least 1 argument for this command!');

		// Get input
		let input = BotNeckAPI.getArgumentsAsString(args);

		// Execute
		message.content = '';
		for(let i = 0; i < input.length; i++)
		{
			if(this.regionals[input[i].toLowerCase()])
				message.content += this.regionals[input[i].toLowerCase()] + '\u200b';
			else
				message.content += input[i];
		}
	}
}
