const BotNeckEvent = require('./BotNeckEvent');

const _onMessageSend = new BotNeckEvent();
const _onMessageReceived = new BotNeckEvent();

module.exports = {
    onMessageSend = _onMessageSend
}