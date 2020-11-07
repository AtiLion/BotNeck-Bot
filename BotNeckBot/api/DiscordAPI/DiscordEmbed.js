class DiscordEmbed {
    /**
     * Creates an easy to use embed wrapper
     * @param {any} embedObject The raw embed object
     */
    constructor(embedObject = null) {
        if(!embedObject) embedObject = { type: 'rich' };
        this.embed = embedObject;
    }

    /**
     * Title of embed
     * @returns {String}
     */
    get Title() { return this.embed.title; }
    /**
     * Title of embed
     * @param {String} title
     */
    set Title(title) { this.embed.title = title; }

    /**
     * Type of embed
     * @returns {String}
     */
    get Type() { return this.embed.type; }
    /**
     * Type of embed
     * @param {String} type
     */
    set Type(type) { this.embed.type = type; }

    /**
     * Description of embed
     * @returns {String}
     */
    get Description() { return this.embed.description; }
    /**
     * Description of embed
     * @param {String} description
     */
    set Description(description) { this.embed.description = description; }

    /**
     * URL of embed
     * @returns {String}
     */
    get Url() { return this.embed.url; }
    /**
     * URL of embed
     * @param {String} url
     */
    set Url(url) { this.embed.url = url; }

    /**
     * Timestamp of embed content
     * @returns {Date}
     */
    get Timestamp() { return new Date(this.embed.timestamp); }
    /**
     * Timestamp of embed content
     * @param {Date} timestamp
     */
    set Timestamp(timestamp) { this.embed.timestamp = timestamp.toISOString(); }

    /**
     * Color code of the embed
     * @returns {Number}
     */
    get Color() { return this.embed.color; }
    /**
     * Color code of the embed
     * @param {Number} color
     */
    set Color(color) { this.embed.color = color; }

    /**
     * Footer information
     * @returns {DiscordEmbedFooter}
     */
    get Footer() { return new DiscordEmbedFooter(this.embed.footer = this.embed.footer || {}); }
    /**
     * Footer information
     * @param {DiscordEmbedFooter} footer
     */
    set Footer(footer) { this.embed.footer = footer.footer; }

    /**
     * Image information
     * @returns {DiscordEmbedImage}
     */
    get Image() { return new DiscordEmbedImage(this.embed.image = this.embed.image || {}); }
    /**
     * Image information
     * @param {DiscordEmbedImage} image
     */
    set Image(image) { this.embed.image = image.image; }
}

class DiscordEmbedFooter {
    /**
     * Creates an easy to use footer wrapper
     * @param {any} footerObject The raw footer object
     */
    constructor(footerObject = null) {
        if(!footerObject) footerObject = {};
        this.footer = footerObject;
    }

    /**
     * Footer text
     * @returns {String}
     */
    get Text() { return this.footer.text; }
    /**
     * Footer text
     * @param {String} text
     */
    set Text(text) { this.footer.text = text; }

    /**
     * Url of footer icon (only supports http(s) and attachments)
     * @returns {String}
     */
    get IconUrl() { return this.footer.icon_url; }
    /**
     * Url of footer icon (only supports http(s) and attachments)
     * @param {String} icon_url
     */
    set IconUrl(icon_url) { this.footer.icon_url = icon_url; }

    /**
     * A proxied url of footer icon
     * @returns {String}
     */
    get ProxyIconUrl() { return this.footer.proxy_icon_url; }
    /**
     * A proxied url of footer icon
     * @param {String} proxy_icon_url
     */
    set ProxyIconUrl(proxy_icon_url) { this.footer.proxy_icon_url = proxy_icon_url; }
}

class DiscordEmbedImage {
    /**
     * Creates an easy to use image wrapper
     * @param {any} imageObject The raw image object
     */
    constructor(imageObject = null) {
        if(!imageObject) imageObject = {};
        this.image = imageObject;
    }

    /**
     * Source url of image (only supports http(s) and attachments)
     * @returns {String}
     */
    get Url() { return this.image.url; }
    /**
     * Source url of image (only supports http(s) and attachments)
     * @param {String} url
     */
    set Url(url) { this.image.url = url; }

    /**
     * A proxied url of the image
     * @returns {String}
     */
    get ProxyUrl() { return this.image.proxy_url; }
    /**
     * A proxied url of the image
     * @param {String} proxy_url
     */
    set ProxyUrl(proxy_url) { this.image.proxy_url = proxy_url; }

    /**
     * Height of image
     * @returns {Number}
     */
    get Height() { return this.image.height; }
    /**
     * Height of image
     * @param {Number} height
     */
    set Height(height) { this.image.height = height; }

    /**
     * Width of image
     * @returns {Number}
     */
    get Width() { return this.image.width; }
    /**
     * Width of image
     * @param {Number} width
     */
    set Width(width) { this.image.width = width; }
}

module.exports = { DiscordEmbed, DiscordEmbedFooter, DiscordEmbedImage }