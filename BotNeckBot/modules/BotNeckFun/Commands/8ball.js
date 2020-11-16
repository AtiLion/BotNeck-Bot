const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class EigthBallCommand extends BotNeckCommand {
    get Command() { return '8ball'; }
    get Description() { return 'The magic 8ball will answer any of your questions(as long as they are a yes or no question)'; }
    get Usage() { return '8ball <question>'; }
    get MinimumArguments() { return 1; }

    get Answers() { return ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes, definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.']; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        BotNeckPresets.createBase(message, {
            Title: 'Magic 8Ball'
        });
        message.Embed.addField('Question', BotNeckCommand.getArgumentsAsString(args));
        message.Embed.addField('Answer', this.Answers[Math.floor(Math.random() * this.Answers.length)]);
    }
}