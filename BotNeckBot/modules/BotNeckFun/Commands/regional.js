const { 
    BotNeckCommand,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class RegionalCommand extends BotNeckCommand {
    get Command() { return 'regional'; }
    get Description() { return 'Changes all letters into regionals'; }
    get Usage() { return 'regional <text>'; }
    get MinimumArguments() { return 1; }

    get Regionals() {
        return {'a': ':regional_indicator_a:', 'b': ':regional_indicator_b:',
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
        '?': '\u2753', ' ': '  '};
    }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        let input = BotNeckCommand.getArgumentsAsString(args);

        message.Content = '';
        for(let i = 0; i < input.length; i++)
		{
			if(this.Regionals[input[i].toLowerCase()])
				message.Content += this.Regionals[input[i].toLowerCase()] + '\u200b';
			else
				message.Content += input[i];
		}
    }
}