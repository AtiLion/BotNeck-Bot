const erlpack = DiscordNative.nativeModules.requireModule('discord_erlpack');
const BotNeckLog = require('../api/BotNeckLog');

const discordAPIUrl = 'https://discordapp.com/api/v8';
const validRequestTypes = [ 'POST', 'GET', 'DELETE', 'PATCH' ];

//------------------------------- Utilities
function safeParseJson(jsonString) {
    if(!jsonString) return null;

    try { return JSON.parse(jsonString); }
    catch (err) { return null; }
}

//------------------------------- XMLHttpRequest.open
const originalHttpOpen = XMLHttpRequest.prototype.open;
function overrideHttpOpen() {
    BotNeckLog.log('Overriding XMLHttpRequest.open ...');

    XMLHttpRequest.prototype.open = function(method, url) {
        let reqResult = originalHttpOpen.apply(this, [].slice.call(arguments));
        this._url = url;

        // We need to handle Discord responses
        this.addEventListener('load', () => {
            const parsedMessage = safeParseJson(this.responseText);
            if(!parsedMessage) return;

            // Invoke post events
            safeInvokeEvent('onResponseReceived', parsedMessage, this.botNeckMessage || false);
        });

        return reqResult;
    }
}

//------------------------------- XMLHttpRequest.setRequestHeader
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

//------------------------------- XMLHttpRequest.send
const originalHttpSend = XMLHttpRequest.prototype.send;
function overrideHttpSend() {
    BotNeckLog.log('Overriding XMLHttpRequest.send ...');
    XMLHttpRequest.prototype.send = function(data) {
        const parsedData = safeParseJson(data);
        if(parsedData) {
            safeInvokeEvent('onRequestSent', parsedData, this.botNeckMessage || false);
            data = JSON.stringify(parsedData);
        }

        // Escalate authorization
        if(this.escalateAuthorization && this._url.startsWith('https://discordapp.com/') && authorizationToken)
            originalHttpSetHeader.call(this, 'Authorization', authorizationToken);

        return originalHttpSend.call(this, data);
    }
}

//------------------------------- AJAX support
const originalAjax = $.ajax;
function overrideAjax() {
    BotNeckLog.log('Overriding AJAX ...');
    $.ajax = function(reqObj) {
        let origBeforeSend = reqObj.beforeSend;

        reqObj.beforeSend = (xhr) => {
            const setRequestHeader = xhr.setRequestHeader;

            { origBeforeSend(xhr); }

            if(xhr.escalateAuthorization && reqObj.url.startsWith('https://discordapp.com/'))
                setRequestHeader('Authorization', authorizationToken);
        };

        return originalAjax.call(this, reqObj);
    }
}

const originalUnpack = erlpack.unpack;
function overrideErlpack() {
    BotNeckLog.log('Overriding erlpack ...');
    erlpack.unpack = function(packedData) {
        let result = originalUnpack(packedData);
        safeInvokeEvent('onWSReceived', result);

        return result;
    }
}

////////////////////////// DiscordNetwork
let _instance = null;
function safeInvokeEvent(event, ...args) {
    if(!event)
        throw 'No event specified!';

    try {
        if(_instance && _instance[event])
            _instance[event].apply(this, args);
    }
    catch (err) { BotNeckLog.error(err, 'Failed to invoke event', event); }
}
class DiscordNetwork {
    /**
     * Creates the DiscordNetwork handler for easy interaction with Discord's API
     */
    constructor() {
        //this.onEventReceived = null;
        this.onRequestSent = null; // Args: Parsed JSON content, Was sent by bot
        this.onResponseReceived = null; // Args: Parsed JSON, Was sent by bot
        this.onWSReceived = null; // Args: Parsed JSON

        if(_instance) {
            BotNeckLog.error('DiscordNetwork instance already exists!');
            return;
        }
        _instance = this;

        // Override all the network functions
        overrideHttpOpen();
        overrideHttpSend();
        overrideHttpSetRequestHeader();
        overrideAjax();
        overrideErlpack();
    }

    /**
     * Returns the main instance of DiscordNetwork
     * @returns {DiscordNetwork}
     */
    static get Instance() { return _instance; }

    /**
     * Sends an unauthorized request to Discord's API with the specified data
     * @param {String} endpoint The endpoint in Discord's API to send the request to
     * @param {String} type The type of request to send (GET, SET, ...)
     * @param {any} jsonData The JSON data to send along with the request
     * @returns {Promise<any>} The JSON object that gets returned from Discord's API
     */
    sendRequest(endpoint, type, jsonData = null) {
        if(_instance !== this) throw 'This instance of DiscordNetwork is invalid!';
        if(!validRequestTypes.includes(type)) throw 'Invalid request type!';
        if(!endpoint) throw 'Empty endpoint!';

        return new Promise((resolve, reject) => {
            if(!endpoint.startsWith('/')) endpoint = '/' + endpoint;
            //if(jsonData) jsonData = safeParseJson(jsonData);

            let req = new XMLHttpRequest();
            req.botNeckMessage = true;

            req.addEventListener('load', () => resolve(safeParseJson(req.responseText)));
            req.addEventListener('error', () => reject());

            req.open(type, discordAPIUrl + endpoint);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(jsonData));
        });
    }
    /**
     * Sends an authorized request to Discord's API with the specified data
     * @param {String} endpoint The endpoint in Discord's API to send the request to
     * @param {String} type The type of request to send (GET, SET, ...)
     * @param {any} jsonData The JSON data to send along with the request
     * @returns {Promise<any>} The JSON object that gets returned from Discord's API
     */
    sendAuthorizedRequest(endpoint, type, jsonData = null) {
        if(_instance !== this) throw 'This instance of DiscordNetwork is invalid!';
        if(!validRequestTypes.includes(type)) throw 'Invalid request type!';
        if(!endpoint) throw 'Empty endpoint!';
        if(!authorizationToken) throw 'No authorization token saved!';

        return new Promise((resolve, reject) => {
            if(!endpoint.startsWith('/')) endpoint = '/' + endpoint;
            //if(jsonData) jsonData = safeParseJson(jsonData);

            let req = new XMLHttpRequest();
            req.botNeckMessage = true;

            req.addEventListener('load', () => resolve(safeParseJson(req.responseText)));
            req.addEventListener('error', () => reject());

            req.open(type, discordAPIUrl + endpoint);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('Authorization', authorizationToken);
            req.send(JSON.stringify(jsonData));
        });
    }
}
/**
 * Cleans up the DiscordNetwork system enough to be used on next start
 */
function DiscordNetworkCleanup() {
    BotNeckLog.log('Removing DiscordNetwork instances ...');
    _instance = null;

    BotNeckLog.log('Resetting XMLHttpRequest.open ...');
    XMLHttpRequest.prototype.open = originalHttpOpen;

    BotNeckLog.log('Resetting XMLHttpRequest.setRequestHeader ...');
    XMLHttpRequest.prototype.setRequestHeader = originalHttpSetHeader;

    BotNeckLog.log('Resetting XMLHttpRequest.send ...');
    XMLHttpRequest.prototype.send = originalHttpSend;

    BotNeckLog.log('Resetting AJAX ...');
    $.ajax = originalAjax;

    BotNeckLog.log('Resetting ErlPack ...');
    erlpack.unpack = originalUnpack;
}
module.exports = { DiscordNetwork, DiscordNetworkCleanup }