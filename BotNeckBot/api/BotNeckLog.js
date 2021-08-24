module.exports = {
    /**
     * Prints a message to the console
     * @param  {...any} message The message to print into the console
     */
    log: function(...message) {
        console.log('%c%s%c%s', 'color: DodgerBlue; font-weight: bold;', '[BotNeck Bot] ', '', ...message);
    },
    
    /**
     * Prints a custom message as well as the error stack into the console
     * @param {Error} error The error stack that gets printed into the console
     * @param  {...any} message The custom message that gets printed along side the error
     */
    error: function(error, ...message) {
        if(message.length > 0)
            console.log('%c%s%c%s', 'color: Red; font-weight: bold;', '[BotNeck Bot] ', '', ...message);
        console.log(error);
    }
}