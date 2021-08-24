const erlpack = DiscordNative.nativeModules.requireModule('discord_erlpack');
const { contextBridge, ipcRenderer } = require('electron');
const BotNeckLog = require('../api/BotNeckLog');
const DiscordWebpack = require('../api/DiscordAPI/DiscordWebpack');

const discordAPIUrl = 'https://discordapp.com/api/v8';
const validRequestTypes = [ 'POST', 'GET', 'DELETE', 'PATCH' ];

const payloads = {};
let hasExposedFunctions = false;

//------------------------------- Utilities
function safeParseJson(jsonString) {
    if(!jsonString) return null;

    try { return JSON.parse(jsonString); }
    catch (err) { return null; }
}
function sendScript(script) {
    ipcRenderer.invoke('bd-run-script', `
        } catch {}});

        (function() { ${script} })();

        (() => {try {
    `);
}


//------------------------------- XMLHttpRequest.open
payloads['httpOpenLoad'] = function(responseText, isBotNeckMessage) {
    const parsedMessage = safeParseJson(responseText);
    if(!parsedMessage) return;

    safeInvokeEvent('onResponseReceived', parsedMessage, isBotNeckMessage);
}

const originalHttpOpen = XMLHttpRequest.prototype.open;
function overrideHttpOpen() {
    BotNeckLog.log('Overriding XMLHttpRequest.open ...');

    if(window.BotNeck.isSandboxed) {
        sendScript(`
            BotNeckBot.originals['originalHttpOpen'] = XMLHttpRequest.prototype.open;

            XMLHttpRequest.prototype.open = function(method, url) {
                const reqResult = BotNeckBot.originals['originalHttpOpen'].apply(this, [].slice.call(arguments));
                this._url = url;

                this.addEventListener('load', () => {
                    BotNeckBot.payloads['httpOpenLoad'](this.responseText, false);
                });

                return reqResult;
            }
        `);
    }
    XMLHttpRequest.prototype.open = function(method, url) {
        const reqResult = originalHttpOpen.apply(this, [].slice.call(arguments));
        this._url = url;

        this.addEventListener('load', () => {
            payloads['httpOpenLoad'](this.responseText, this.botNeckMessage || false);
        });

        return reqResult;
    }
}
function cleanHttpOpen() {
    BotNeckLog.log('Cleaning XMLHttpRequest.open ...');

    if(window.BotNeck.isSandboxed)
        sendScript(`XMLHttpRequest.prototype.open = BotNeckBot.originals['originalHttpOpen']`);
    XMLHttpRequest.prototype.open = originalHttpOpen;
}


//------------------------------- XMLHttpRequest.setRequestHeader
let authorizationToken = null;
payloads['httpSetHeader'] = function(header, value, isBotNeckMessage, url) {
    if(url.startsWith('https://discordapp.com') && header.toLowerCase() === 'authorization' && !isBotNeckMessage)  {
        if(!authorizationToken)
            BotNeckLog.log('Set authorization token!');
        else if(authorizationToken !== value)
            BotNeckLog.log('Updated authorization token!');

        authorizationToken = value; // Save the token for authorized requests
    }
}

const originalHttpSetHeader = XMLHttpRequest.prototype.setRequestHeader;
function overrideHttpSetRequestHeader() {
    BotNeckLog.log('Overriding XMLHttpRequest.setRequestHeader ...');

    if(window.BotNeck.isSandboxed) {
        sendScript(`
            BotNeckBot.originals['originalHttpSetHeader'] = XMLHttpRequest.prototype.setRequestHeader;

            XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
                BotNeckBot.payloads['httpSetHeader'](header, value, false, this._url);

                return BotNeckBot.originals['originalHttpSetHeader'].call(this, header, value);
            }
        `);
    }
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        payloads['httpSetHeader'](header, value, this.botNeckMessage || false, this._url);
        
        return originalHttpSetHeader.call(this, header, value);
    }
}
function cleanHttpSetRequestHeader() {
    BotNeckLog.log('Cleaning XMLHttpRequest.setRequestHeader ...');

    if(window.BotNeck.isSandboxed)
        sendScript(`XMLHttpRequest.prototype.setRequestHeader = BotNeckBot.originals['originalHttpSetHeader']`);
    XMLHttpRequest.prototype.setRequestHeader = originalHttpSetHeader;
}


//------------------------------- XMLHttpRequest.send
payloads['httpSend'] = function(data, isBotNeckMessage, escalateAuthorization, url) {
    const parsedData = safeParseJson(data);
    if(parsedData) {
        safeInvokeEvent('onRequestSent', parsedData, isBotNeckMessage);
        data = JSON.stringify(parsedData);
    }

    const authorization = null;
    if(escalateAuthorization && url.startsWith('https://discordapp.com/') && authorizationToken)
        authorization = authorizationToken;

    return { data, authorization };
}

const originalHttpSend = XMLHttpRequest.prototype.send;
function overrideHttpSend() {
    BotNeckLog.log('Overriding XMLHttpRequest.send ...');

    if(window.BotNeck.isSandboxed) {
        sendScript(`
            BotNeckBot.originals['originalHttpSend'] = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.send = function(originalData) {
                const { data, authorization } = BotNeckBot.payloads['httpSend'](originalData, false, this.escalateAuthorization, this._url);

                if(authorization) this.setRequestHeader('Authorization', authorization);
                return BotNeckBot.originals['originalHttpSend'].call(this, data);
            }
        `);
    }
    XMLHttpRequest.prototype.send = function(originalData) {
        const { data, authorization } = payloads['httpSend'](originalData, this.botNeckMessage || false, this.escalateAuthorization, this._url);

        if(authorization) this.setRequestHeader('Authorization', authorization);
        return originalHttpSend.call(this, data);
    }
}
function cleanHttpSend() {
    BotNeckLog.log('Cleaning XMLHttpRequest.send ...');

    if(window.BotNeck.isSandboxed)
        sendScript(`XMLHttpRequest.prototype.send = BotNeckBot.originals['originalHttpSend']`);
    XMLHttpRequest.prototype.send = originalHttpSend;
}


// EarlPack
payloads['earlpack'] = function(packedData) {
    let result = originalUnpack(packedData);
    safeInvokeEvent('onWSReceived', result);

    return result;
}

const originalUnpack = erlpack.unpack;
function overrideErlpack() {
    BotNeckLog.log('Overriding erlpack ...');

    if(window.BotNeck.isSandboxed) {
        // TODO: For some reason these no longer get cached on the main process, figure out how to fix that?
        sendScript(`
            const erlpack = DiscordNative.nativeModules.requireModule('discord_erlpack');
            BotNeckBot.originals['originalUnpack'] = erlpack.unpack;

            console.log(erlpack);
            erlpack.unpack = function(packedData) {
                return BotNeckBot.payloads['earlpack'](packedData);
            }
        `);
    }
    erlpack.unpack = function(packedData) {
        return payloads['earlpack'](packedData);
    }
}
function cleanEarlpack() {
    BotNeckLog.log('Cleaning erlpack ...');

    if(window.BotNeck.isSandboxed) {
        sendScript(`
            const erlpack = DiscordNative.nativeModules.requireModule('discord_erlpack');

            erlpack.unpack = BotNeckBot.originals['originalUnpack'];
        `);
    }
    erlpack.unpack = originalUnpack;
}


//------------------------------- AJAX support
window.$ = window.$ || { ajax: function() {} }; // TODO: Initialize or replicate AJAX
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

        if(!hasExposedFunctions && window.BotNeck.isSandboxed) {
            hasExposedFunctions = true;

            contextBridge.exposeInMainWorld('BotNeckBotPayloads', payloads);
            sendScript(`
                const BotNeckBot = window.BotNeckBot = window.BotNeckBot || {};
                
                BotNeckBot.originals = BotNeckBot.originals || {};
                BotNeckBot.payloads = window.BotNeckBotPayloads;
            `);
        }

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
        //if(!authorizationToken) throw 'No authorization token saved!';
        if(!authorizationToken) {
            let authObject = DiscordWebpack.getByProps('FINGERPRINT_KEY');
            if(!authObject) throw 'No authorization token saved!';

            authorizationToken = authObject.getToken();
            BotNeckLog.log('Found the token through webpack!');
        }

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

    cleanHttpOpen();
    cleanHttpSetRequestHeader();
    cleanHttpSend();
    cleanEarlpack();

    BotNeckLog.log('Cleaning AJAX ...');
    $.ajax = originalAjax;
}
module.exports = { DiscordNetwork, DiscordNetworkCleanup }