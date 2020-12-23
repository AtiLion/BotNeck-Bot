const { 
    BotNeckCommand,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class RollCommand extends BotNeckCommand {
    get Command() { return 'roll'; }
    get Description() { return 'Rolls the dice'; }
    get Usage() { return 'roll [max value] dice=[number of dice to roll]'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        let maxValue = 6;
        if(args[0] && !isNaN(args[0]))
            maxValue = Number(args[0]);

        let rollAmount = 1;
        if(args['dice'] && !isNaN(args['dice']))
            rollAmount = Number(args['dice']);

        let diceValues = [];
        let sum = 0;
        for(let i = 0; i < rollAmount; i++) {
            let num = Math.floor(Math.random() * maxValue + 1);

            diceValues.push(num);
            sum += num;
        }
        BotNeckPresets.createBase(message, {
            Title: 'Roll the dice',
            Description: `The dices have rolled: ${diceValues.join(', ')}`,
            Fields: [
                {
                    Name: 'Sum of dice',
                    Value: String(sum),
                    Inline: true
                },
                {
                    Name: 'Max roll value',
                    Value: String(maxValue),
                    Inline: true
                },
                {
                    Name: 'Number of dice',
                    Value: String(rollAmount),
                    Inline: true
                }
            ]
        });
    }
}