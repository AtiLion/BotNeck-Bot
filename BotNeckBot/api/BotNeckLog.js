module.exports = {
    /**
     * Prints a message to the console
     * @param  {...any} message The message to print into the console
     */
    log: function(...message) {
        console.log('%c%s%c%s', 'color: DodgerBlue', '[BotNeck Bot] ', 'color: White', ...message);
    },
    
    /**
     * Prints a custom message as well as the error stack into the console
     * @param {Error} error The error stack that gets printed into the console
     * @param  {...any} message The custom message that gets printed along side the error
     */
    error: function(error, ...message) {
        console.log('%c%s%c%s', 'color: Red', '[BotNeck Bot] ', 'color: White', ...message);
        console.error(error);
    }
}