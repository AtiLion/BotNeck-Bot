const { 
    BotNeckCommand,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class FlipCommand extends BotNeckCommand {
    get Command() { return 'flip'; }
    get Description() { return 'Flip the text'; }
    get Usage() { return 'flip [text]'; }
    get MinimumArguments() { return 1; }

    get CharList() { return 'abcdefghijklmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWYZ12345679!&*(),.\''; }
    get AltCharList() { return 'ɐqɔpǝɟƃɥᴉɾʞlɯudbɹʇnʌʍxʎz∀qƆpƎℲפHIſʞ˥WNԀQɹ┴∩ΛM⅄ZƖᄅƐㄣϛ9ㄥ6¡⅋*)(\'˙,'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        let input = BotNeckCommand.getArgumentsAsString(args);

        message.Content = '';
        for(let i = 0; i < input.length; i++) {
            let index = this.CharList.indexOf(input[i]);

            if(index < 0) message.Content += input[i];
            else message.Content += this.AltCharList[index];
        }
    }
}