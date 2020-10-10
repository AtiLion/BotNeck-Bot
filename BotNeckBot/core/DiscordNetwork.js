const originalRequestOpen = XMLHttpRequest.prototype.open;
const originalRequestSetHeader = XMLHttpRequest.prototype.setRequestHeader;
const originalRequestSend = XMLHttpRequest.prototype.send;

const originalWSSend = WebSocket.prototype.send;
let DiscordWebSocket = null;

module.exports = class DiscordNetwork {
    constructor() {
    }

    HookNetworking() {
        XMLHttpRequest.prototype.open = function() {
            return originalRequestOpen.apply(this, [].slice.call(arguments));
        }
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            return originalRequestSetHeader.call(this, header, value);
        }
        XMLHttpRequest.prototype.send = function(data) {
            return originalRequestSend.call(this, data);
        }

        WebSocket.prototype.send = function() {
            if(this.url.startsWith('wss://wss://gateway.discord.gg/')) {
                DiscordWebSocket = this;
                WebSocket.prototype.send = originalWSSend;

                console.log('Saved Discord WebSocket!');
            }
            return originalWSSend.apply(this, [].slice.call(arguments));
        }
    }
}