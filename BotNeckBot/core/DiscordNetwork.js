/*const pako = require('pako');
const erlpack = DiscordNative.nativeModules.requireModule('discord_erlpack');*/
const BotNeckLog = require('../api/BotNeckLog');

const discordAPIUrl = 'https://discordapp.com/api/v8';
const validRequestTypes = [ 'POST', 'GET', 'DELETE', 'PATCH' ];
/*const pakoInflate = new pako.Inflate({
    chunkSize: 65536,
    to: 'string'
});*/

////////////////////////// Utilities
function safeParseJson(jsonString) {
    if(!jsonString) return null;

    try { return JSON.parse(jsonString); }
    catch (err) { return null; }
}

////////////////////////// XMLHttpRequest.open
const originalHttpOpen = XMLHttpRequest.prototype.open;
function overrideHttpOpen() {
    BotNeckLog.log('Overriding XMLHttpRequest.open ...');

    XMLHttpRequest.prototype.open = function() {
        let reqResult = originalHttpOpen.apply(this, [].slice.call(arguments));

        // We need to handle Discord responses
        this.addEventListener('load', () => {
            const parsedMessage = safeParseJson(this.responseText);
            if(!parsedMessage) return;

            // Invoke post events
            safeInvokeEvent('onResponseReceived', parsedMessage, this.botNeckMessage);
        });

        return reqResult;
    }
}

////////////////////////// XMLHttpRequest.setRequestHeader
let authorizationToken = null;
const originalHttpSetHeader = XMLHttpRequest.prototype.setRequestHeader;
function overrideHttpSetRequestHeader() {
    BotNeckLog.log('Overriding XMLHttpRequest.setRequestHeader ...');

    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if(header.toLowerCase() === 'authorization' && !this.botNeckMessage)  {
            if(!authorizationToken)
                BotNeckLog.log('Set authorization token!');
            else if(authorizationToken !== value)
                BotNeckLog.log('Updated authorization token!');

            authorizationToken = value; // Save the token for authorized requests
        }
        
        return originalHttpSetHeader.call(this, header, value);
    }
}

////////////////////////// XMLHttpRequest.send
const originalHttpSend = XMLHttpRequest.prototype.send;
function overrideHttpSend() {
    BotNeckLog.log('Overriding XMLHttpRequest.send ...');
    XMLHttpRequest.prototype.send = function(data) {
        const parsedData = safeParseJson(data);
        if(parsedData) {
            safeInvokeEvent('onRequestSent', parsedData, this.botNeckMessage);
            data = JSON.stringify(parsedData);
        }

        return originalHttpSend.call(this, data);
    }
}

// TODO: Somehow fix the websockets
// Websocket stuff, fix later
{
// We need to hook WebSocket sending to find the Discord websocket
/*const originalWSSend = WebSocket.prototype.send;
WebSocket.prototype.send = function() {
    if(this.url.startsWith('wss://gateway.discord.gg/')) {
        BotNeckLog.log('Found and saved Discord WebSocket instance!');

        discordWebSocket = this;
        originalWSOnMessage = this.onmessage;
        this.onmessage = handleWSOnMessage;
        WebSocket.prototype.send = originalWSSend;
    }
    return originalWSSend.apply(this, [].slice.call(arguments));
}*/

/*let discordWebSocket = null;
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
}*/
}

////////////////////////// DiscordNetwork
const NetworkInstances = [];
function safeInvokeEvent(event, ...args) {
    if(!event)
        throw 'No event specified!';

    for(let instance of NetworkInstances) {
        try {
            if(instance[event])
                instance[event].apply(this, args);
        } catch (err) { BotNeckLog.error(err, 'Failed to invoke event', event); }
    }
}
class DiscordNetwork {
    constructor() {
        //this.onEventReceived = null;
        this.onRequestSent = null; // Args: Parsed JSON content, Was sent by bot
        this.onResponseReceived = null; // Args: Parsed JSON, Was sent by bot

        if(NetworkInstances.length > 1) {
            BotNeckLog.error('DiscordNetwork has exceeded the maximum number of network instances!');
            return;
        }
        NetworkInstances.push(this);

        // Override all the http functions
        overrideHttpOpen();
        overrideHttpSend();
        overrideHttpSetRequestHeader();
    }

    sendRequest(endpoint, type, jsonData) {
        if(!NetworkInstances.includes(this)) throw 'This instance of DiscordNetwork is invalid!';
        if(!validRequestTypes.includes(type)) throw 'Invalid request type!';
        if(!endpoint) throw 'Empty endpoint!';

        return new Promise((resolve, reject) => {
            if(!endpoint.startsWith('/')) endpoint = '/' + endpoint;
            if(jsonData) jsonData = safeParseJson(jsonData);

            let req = new XMLHttpRequest();
            req.botNeckMessage = true;

            req.addEventListener('load', () => resolve(safeParseJson(req.responseText)));
            req.addEventListener('error', () => reject());

            req.open(type, discordAPIUrl + endpoint);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(jsonData);
        });
    }
    sendAuthorizedRequest(endpoint, type, jsonData) {
        if(!NetworkInstances.includes(this)) throw 'This instance of DiscordNetwork is invalid!';
        if(!validRequestTypes.includes(type)) throw 'Invalid request type!';
        if(!endpoint) throw 'Empty endpoint!';
        if(!authorizationToken) throw 'No authorization token saved!';

        return new Promise((resolve, reject) => {
            if(!endpoint.startsWith('/')) endpoint = '/' + endpoint;
            if(jsonData) jsonData = safeParseJson(jsonData);

            let req = new XMLHttpRequest();
            req.botNeckMessage = true;

            req.addEventListener('load', () => resolve(safeParseJson(req.responseText)));
            req.addEventListener('error', () => reject());

            req.open(type, discordAPIUrl + endpoint);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('Authorization', authorizationToken);
            req.send(jsonData);
        });
    }
}
function DiscordNetworkCleanup() {
    BotNeckLog.log('Removing DiscordNetwork instances ...');
    while(NetworkInstances.length)
        NetworkInstances.pop();

    BotNeckLog.log('Resetting XMLHttpRequest.open ...');
    XMLHttpRequest.prototype.open = originalHttpOpen;

    BotNeckLog.log('Resetting XMLHttpRequest.setRequestHeader ...');
    XMLHttpRequest.prototype.setRequestHeader = originalHttpSetHeader;

    BotNeckLog.log('Resetting XMLHttpRequest.send ...');
    XMLHttpRequest.prototype.send = originalHttpSend;
}
module.exports = { DiscordNetwork, DiscordNetworkCleanup }