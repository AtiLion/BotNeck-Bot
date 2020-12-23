const { DiscordEmbed } = require('./DiscordEmbed');

class DiscordClientMessageBase {
    /**
     * Creates an easy to use client message wrapper
     * @param {any} messageObject The raw client message object
     */
    constructor(messageObject = null) {
        if(!messageObject) messageObject = {};
        this.message = messageObject;
    }

    /**
     * The message contents (up to 2000 characters)
     * @returns {String}
     */
    get Content() { return this.message.content; }
    /**
     * The message contents (up to 2000 characters)
     * @param {String} content
     */
    set Content(content) { this.message.content = content; }

    /**
     * Embedded rich content
     * @returns {DiscordEmbed}
     */
    get Embed() { return new DiscordEmbed(this.message.embed = this.message.embed || {}); }
    /**
     * Embedded rich content
     * @param {DiscordEmbed} embed
     */
    set Embed(embed) {
        if(!embed) delete this.message.embed;
        else if(embed instanceof DiscordEmbed) this.message.embed = embed.embed;
        else {
            let dObj = new DiscordEmbed();

            for(let key in embed) dObj[key] = embed[key];
            this.message.embed = dObj.embed;
        }
    }
}
class DiscordClientMessage extends DiscordClientMessageBase {
    /**
     * Creates an easy to use client message wrapper
     * @param {any} messageObject The raw client message object
     */
    constructor(messageObject = null) {
        super(messageObject);
    }
    
    /**
     * A nonce that can be used for optimistic message sending
     * @returns {String|Number}
     */
    get Nonce() { return this.message.nonce; }
    /**
     * A nonce that can be used for optimistic message sending
     * @param {String|Number} nonce
     */
    set Nonce(nonce) { this.message.nonce = nonce; }

    /**
     * True if this is a TTS message
     * @returns {Boolean}
     */
    get TTS() { return this.message.tts; }
    /**
     * True if this is a TTS message
     * @param {Boolean} tts
     */
    set TTS(tts) { this.message.tts = tts; }

    /**
     * The contents of the file being sent
     * @returns {String}
     */
    get File() { return this.message.file; }
    /**
     * The contents of the file being sent
     * @param {String} file
     */
    set File(file) { this.message.file = file; }
}

class DiscordMessage {
    /**
     * Creates an easy to use message wrapper
     * @param {any} messageObject The raw message object
     */
    constructor(messageObject = null) {
        if(!messageObject) messageObject = {};
        this.message = messageObject;
    }

    /**
     * Id of the message
     * @returns {String}
     */
    get Id() { return this.message.id; }

    /**
     * Id of the channel
     * @returns {String}
     */
    get ChannelId() { return this.message.channel_id; }

    /**
     * The message contents (up to 2000 characters)
     * @returns {String}
     */
    get Content() { return this.message.content; }

    /**
     * Embedded rich content
     * @returns {DiscordEmbed}
     */
    get Embed() { return new DiscordEmbed(this.message.embed = this.message.embed || {}); }

    /**
     * True if this is a TTS message
     * @returns {Boolean}
     */
    get TTS() { return this.message.tts; }

    /**
     * A nonce that can be used for optimistic message sending
     * @returns {String|Number}
     */
    get Nonce() { return this.message.nonce; }

    /**
     * Edits the current message
     * @param {DiscordClientMessageBase} newMessage The new contents of the message
     */
    editMessage(newMessage) {
        if(!(newMessage instanceof DiscordClientMessageBase)) {
            let dObj = new DiscordClientMessageBase();

            for(let key in newMessage) dObj[key] = newMessage[key];
            newMessage = dObj;
        }

        return new Promise((resolve, reject) => {
            BotNeckClient.sendAuthorizedRequest(`/channels/${this.ChannelId}/messages/${this.Id}`, 'PATCH', newMessage.message)
            .then(newObj => {
                this.message = newObj;
                resolve();
            }).catch(reject);
        });
    }
}

module.exports = { DiscordClientMessageBase, DiscordClientMessage, DiscordMessage }
const BotNeckClient = require('../BotNeckClient');