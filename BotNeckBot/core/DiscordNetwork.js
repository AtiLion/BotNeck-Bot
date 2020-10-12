const pako = require('pako');
const erlpack = DiscordNative.nativeModules.requireModule('discord_erlpack');
const BotNeckLog = require('../api/BotNeckLog');

const pakoInflate = new pako.Inflate({
    chunkSize: 65536,
    to: 'string'
});

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
    let data = new Uint8Array(ev.data);

    pakoInflate.push(data, validateZLib(data) && pako.Z_SYNC_FLUSH);
    if(pakoInflate.err) return;

    data = pakoInflate.result;
    data = erlpack.unpack(data);
    for(let instance of NetworkInstances) {
        try {
            if(instance.onEventReceived)
                instance.onEventReceived(data);
        }
        catch (err) { BotNeckLog.error(err, 'Failed to call event received successfully!'); }
    }

    /*if(validateZLib(new Int8Array(data))) {
        zlib.inflateRaw(data, { flush: zlib.constants.Z_SYNC_FLUSH }, (err, data) => {
            if(err) return BotNeckLog.error(err, 'Failed to inflate Discord message!');
    
            data = erlpack.unpack(data);
            for(let instance of NetworkInstances) {
                try {
                    if(instance.onEventReceived)
                        instance.onEventReceived(data);
                }
                catch (err) { BotNeckLog.error(err, 'Failed to call event received successfully!'); }
            }
        });
    } else BotNeckLog.log('Failed to validate ZLib data!');*/

    if(originalWSOnMessage)
        return originalWSOnMessage(ev);
}
function validateZLib(data) {
    const len = data.length;
    if(len < 4) return false;

    //const zlibFlush = [ -1, -1, 0, 0 ];
    const zlibFlush = [ 0xff, 0xff, 0x00, 0x00 ];
    for(let i = 0; i < zlibFlush.length; i++)
        if(data[len - (i + 1)] !== zlibFlush[i]) return false;   
    return true;
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