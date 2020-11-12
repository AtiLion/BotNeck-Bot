const { DiscordEmbed } = require('./DiscordEmbed');

class DiscordClientMessage {
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
    set Embed(embed) { this.message.embed = embed.embed; } // TODO: Embeds from objects
    
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
     * Id of the message
     * @param {String} id
     */
    set Id(id) { this.message.id = id; }
}

module.exports = { DiscordClientMessage, DiscordMessage }