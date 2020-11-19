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
    set Footer(footer) {
        if(!footer) delete this.embed.footer;
        else if(footer instanceof DiscordEmbedFooter) this.embed.footer = footer.footer;
        else {
            let dObj = new DiscordEmbedFooter();

            for(let key in footer) dObj[key] = footer[key];
            this.embed.footer = dObj.footer;
        }
    }

    /**
     * Image information
     * @returns {DiscordEmbedImage}
     */
    get Image() { return new DiscordEmbedImage(this.embed.image = this.embed.image || {}); }
    /**
     * Image information
     * @param {DiscordEmbedImage} image
     */
    set Image(image) {
        if(!image) delete this.embed.image;
        else if(image instanceof DiscordEmbedImage) this.embed.image = image.image;
        else {
            let dObj = new DiscordEmbedImage();

            for(let key in image) dObj[key] = image[key];
            this.embed.image = dObj.image;
        }
    }

    /**
     * Thumbnail information
     * @returns {DiscordEmbedThumbnail}
     */
    get Thumbnail() { return new DiscordEmbedThumbnail(this.embed.thumbnail = this.embed.thumbnail || {}); }
    /**
     * Thumbnail information
     * @param {DiscordEmbedThumbnail} thumbnail
     */
    set Thumbnail(thumbnail) {
        if(!thumbnail) delete this.embed.thumbnail;
        else if(thumbnail instanceof DiscordEmbedThumbnail) this.embed.thumbnail = thumbnail.thumbnail;
        else {
            let dObj = new DiscordEmbedThumbnail();

            for(let key in thumbnail) dObj[key] = thumbnail[key];
            this.embed.thumbnail = dObj.thumbnail;
        }
    }

    /**
     * Video information
     * @returns {DiscordEmbedVideo}
     */
    get Video() { return new DiscordEmbedVideo(this.embed.video = this.embed.video || {}); }
    /**
     * Video information
     * @param {DiscordEmbedVideo} video
     */
    set Video(video) {
        if(!video) delete this.embed.video;
        else if(video instanceof DiscordEmbedVideo) this.embed.video = video.video;
        else {
            let dObj = new DiscordEmbedVideo();

            for(let key in video) dObj[key] = video[key];
            this.embed.video = dObj.video;
        }
    }

    /**
     * Provider information
     * @returns {DiscordEmbedProvider}
     */
    get Provider() { return new DiscordEmbedProvider(this.embed.provider = this.embed.provider || {}); }
    /**
     * Provider information
     * @param {DiscordEmbedProvider} provider
     */
    set Provider(provider) {
        if(!provider) delete this.embed.provider;
        else if(provider instanceof DiscordEmbedProvider) this.embed.provider = provider.provider;
        else {
            let dObj = new DiscordEmbedProvider();

            for(let key in provider) dObj[key] = provider[key];
            this.embed.provider = dObj.provider;
        }
    }

    /**
     * Author information
     * @returns {DiscordEmbedAuthor}
     */
    get Author() { return new DiscordEmbedAuthor(this.embed.author = this.embed.author || {}); }
    /**
     * Author information
     * @param {DiscordEmbedAuthor} author
     */
    set Author(author) {
        if(!author) delete this.embed.author;
        else if(author instanceof DiscordEmbedAuthor) this.embed.author = author.author;
        else {
            let dObj = new DiscordEmbedAuthor();

            for(let key in author) dObj[key] = author[key];
            this.embed.author = dObj.author;
        }
    }

    /**
     * Fields information
     * @returns {[DiscordEmbedField]}
     */
    get Fields() {
        let outFields = [];

        if(!this.embed.fields) return outFields;
        for(let field of this.embed.fields)
            outFields.push(new DiscordEmbedField(field));
        return outFields;
    }
    /**
     * Fields information
     * @param {[DiscordEmbedField]} fields
     */
    set Fields(fields) {
        if(!fields) return this.embed.fields = [];
        let outFields = [];

        for(let field of fields) {
            if(!field) continue;

            if(field instanceof DiscordEmbedField) outFields.push(field.field);
            else {
                let dObj = new DiscordEmbedField();

                for(let key in field) dObj[key] = field[key];
                outFields.push(dObj.field);
            }
        }
    }
    /**
     * Adds field to embed
     * @param {String} name The name of the field
     * @param {String} value The value of the field
     * @param {Boolean} inline Whether or not this field should display inline
     */
    addField(name, value, inline = false) {
        if(!this.embed.fields) this.embed.fields = [];

        this.embed.fields.push({ name, value, inline });
    }
    /**
     * Removes a field using an index
     * @param {Number} index The index of the field to remove
     */
    removeField(index) {
        if(!this.embed.fields) return this.embed.fields = [];

        this.embed.fields.splice(index, 1);
    }
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

class DiscordEmbedThumbnail {
    /**
     * Creates an easy to use thumbnail wrapper
     * @param {any} thumbnailObject The raw thumbnail object
     */
    constructor(thumbnailObject = null) {
        if(!thumbnailObject) thumbnailObject = {};
        this.thumbnail = thumbnailObject;
    }

    /**
     * Source url of thumbnail (only supports http(s) and attachments)
     * @returns {String}
     */
    get Url() { return this.thumbnail.url; }
    /**
     * Source url of thumbnail (only supports http(s) and attachments)
     * @param {String} url
     */
    set Url(url) { this.thumbnail.url = url; }

    /**
     * A proxied url of the thumbnail
     * @returns {String}
     */
    get ProxyUrl() { return this.thumbnail.proxy_url; }
    /**
     * A proxied url of the thumbnail
     * @param {String} proxy_url
     */
    set ProxyUrl(proxy_url) { this.thumbnail.proxy_url = proxy_url; }

    /**
     * Height of thumbnail
     * @returns {Number}
     */
    get Height() { return this.thumbnail.height; }
    /**
     * Height of thumbnail
     * @param {Number} height
     */
    set Height(height) { this.thumbnail.height = height; }

    /**
     * Width of thumbnail
     * @returns {Number}
     */
    get Width() { return this.thumbnail.width; }
    /**
     * Width of thumbnail
     * @param {Number} width
     */
    set Width(width) { this.thumbnail.width = width; }
}

class DiscordEmbedVideo {
    /**
     * Creates an easy to use video wrapper
     * @param {any} videoObject The raw video object
     */
    constructor(videoObject = null) {
        if(!videoObject) videoObject = {};
        this.video = videoObject;
    }

    /**
     * Source url of video
     * @returns {String}
     */
    get Url() { return this.video.url; }
    /**
     * Source url of video
     * @param {String} url
     */
    set Url(url) { this.video.url = url; }

    /**
     * Height of video
     * @returns {Number}
     */
    get Height() { return this.video.height; }
    /**
     * Height of video
     * @param {Number} height
     */
    set Height(height) { this.video.height = height; }

    /**
     * Width of video
     * @returns {Number}
     */
    get Width() { return this.video.width; }
    /**
     * Width of video
     * @param {Number} width
     */
    set Width(width) { this.video.width = width; }
}

class DiscordEmbedProvider {
    /**
     * Creates an easy to use provider wrapper
     * @param {any} providerObject The raw provider object
     */
    constructor(providerObject = null) {
        if(!providerObject) providerObject = {};
        this.provider = providerObject;
    }

    /**
     * Name of provider
     * @returns {String}
     */
    get Name() { return this.provider.name; }
    /**
     * Name of provider
     * @param {String} name
     */
    set Name(name) { this.provider.name = name; }

    /**
     * Url of provider
     * @returns {String}
     */
    get Url() { return this.provider.url; }
    /**
     * Url of provider
     * @param {String} url
     */
    set Url(url) { this.provider.url = url; }
}

class DiscordEmbedAuthor {
    /**
     * Creates an easy to use author wrapper
     * @param {any} authorObject The raw author object
     */
    constructor(authorObject = null) {
        if(!authorObject) authorObject = {};
        this.author = authorObject;
    }

    /**
     * Name of author
     * @returns {String}
     */
    get Name() { return this.author.name; }
    /**
     * Name of author
     * @param {String} name
     */
    set Name(name) { this.author.name = name; }

    /**
     * Url of author
     * @returns {String}
     */
    get Url() { return this.author.url; }
    /**
     * Url of author
     * @param {String} url
     */
    set Url(url) { this.author.url = url; }

    /**
     * Url of author icon (only supports http(s) and attachments)
     * @returns {String}
     */
    get IconUrl() { return this.author.icon_url; }
    /**
     * Url of author icon (only supports http(s) and attachments)
     * @param {String} icon_url
     */
    set IconUrl(icon_url) { this.author.icon_url = icon_url; }

    /**
     * A proxied url of author icon
     * @returns {String}
     */
    get ProxyIconUrl() { return this.author.proxy_icon_url; }
    /**
     * A proxied url of author icon
     * @param {String} proxy_icon_url
     */
    set ProxyIconUrl(proxy_icon_url) { this.author.proxy_icon_url = proxy_icon_url; }
}

class DiscordEmbedField {
    /**
     * Creates an easy to use field wrapper
     * @param {any} fieldObject The raw field object
     */
    constructor(fieldObject = null) {
        if(!fieldObject) fieldObject = {};
        this.field = fieldObject;
    }

    /**
     * Name of the field
     * @returns {String}
     */
    get Name() { return this.field.name; }
    /**
     * Name of the field
     * @param {String} name
     */
    set Name(name) { this.field.name = name; }

    /**
     * Value of the field
     * @returns {String}
     */
    get Value() { return this.field.value; }
    /**
     * Value of the field
     * @param {String} value
     */
    set Value(value) { this.field.value = value; }

    /**
     * Whether or not this field should display inline
     * @returns {Boolean}
     */
    get Inline() { return this.field.inline; }
    /**
     * Whether or not this field should display inline
     * @param {Boolean} inline
     */
    set Inline(inline) { this.field.inline = inline; }
}

module.exports = {
    DiscordEmbed,
    DiscordEmbedFooter,
    DiscordEmbedImage,
    DiscordEmbedThumbnail,
    DiscordEmbedVideo,
    DiscordEmbedProvider,
    DiscordEmbedAuthor,
    DiscordEmbedField
}