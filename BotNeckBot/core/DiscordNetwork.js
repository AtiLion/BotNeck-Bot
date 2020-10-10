const BotNeckLog = require('../api/BotNeckLog');

const originalRequestOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
    return originalRequestOpen.apply(this, [].slice.call(arguments));
}

const originalRequestSetHeader = XMLHttpRequest.prototype.setRequestHeader;
XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    return originalRequestSetHeader.call(this, header, value);
}

const originalRequestSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(data) {
    return originalRequestSend.call(this, data);
}

// We need to hook WebSocket sending to find the Discord websocket
const originalWSSend = WebSocket.prototype.send;
WebSocket.prototype.send = function() {
    if(this.url.startsWith('wss://gateway.discord.gg/')) {
        BotNeckLog.log('Found and saved Discord WebSocket instance!');

        discordWebSocket = this;
        originalWSOnMessage = this.onmessage;
        this.onmessage = handleWSOnMessage;
        WebSocket.prototype.send = originalWSSend;
    }
    return originalWSSend.apply(this, [].slice.call(arguments));
}

let discordWebSocket = null;
let originalWSOnMessage = null;
function handleWSOnMessage(ev) {
    for(let instance of NetworkInstances) {
        try {
            if(instance.onEventReceived)
                instance.onEventReceived(ev);
        }
        catch (err) { BotNeckLog.error(err, 'Failed to call event received successfully!'); }
    }
    if(originalWSOnMessage)
        originalWSOnMessage(ev);
}

const NetworkInstances = [];
module.exports = class DiscordNetwork {
    constructor() {
        this.onEventReceived = null;
        this.onRequestSent = null;
        this.onResponseReceived = null;

        if(NetworkInstances.length > 5)
            throw 'DiscordNetwork has exceeded the maximum number of network instances!';
        NetworkInstances.push(this);
    }

    sendRequest() {
    }
    sendAuthorizedRequest() {
    }
}