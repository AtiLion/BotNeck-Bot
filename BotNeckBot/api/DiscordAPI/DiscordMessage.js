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

    //TODO: Implement Embeds!
    
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
}

module.exports = { DiscordClientMessage, DiscordMessage }