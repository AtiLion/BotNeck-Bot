module.exports = class BotNeckLog {
    static log(...message) {
        console.log('%c%s%c%s', 'color: DodgerBlue', '[BotNeck Bot]', 'color: Black', ...message);
    }
    static error(error, ...message) {
        console.log('%c%s%c%s', 'color: Red', '[BotNeck Bot]', 'color: Black', ...message);
        console.error(error);
    }
}