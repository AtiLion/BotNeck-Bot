const request = require('request');
const { 
    BotNeckCommand,
    BotNeckClient,
    BotNeckPresets,
    BotNeckLog,
    DiscordAPI: {
        DiscordClientMessage,
        DiscordClientMessageBase
    }
} = require('../../BotNeckAPI');

module.exports = class MALCommand extends BotNeckCommand {
    get Command() { return 'mal'; }
    get Description() { return 'Looks up a specific anime/manga'; }
    get Usage() { return 'mal <anime/manga> <search query> [index]'; }
    get MinimumArguments() { return 2; }

    get APIUrl() { return 'https://api.jikan.moe/v3/'; }
    get APITypes() { return ['anime', 'manga']; }

    /**
     * Gets a list of MAL anime/manga titles
     * @param {String} url The url to send the request to
     * @param {String} title The title of the specific anime/manga
     * @returns {Promise} Request output
     */
    getMALList(url, title) {
        return new Promise((resolve) => {
            let options = {
                url: url,
                method: 'GET',
                qs: {
                    q: title,
                    page: 1
                },
                json: true
            }
            request(options, (err, response, body) => resolve({ err, response, body }));
        });
    }
    /**
     * Gets MAL information on anime/manga of a specific title
     * @param {String} url The url to send the request to
     * @returns {Promise} Request output
     */
    getMALInfo(url) {
        return new Promise((resolve) => {
            let options = {
                url: url,
                method: 'GET',
                json: true
            }
            request(options, (err, response, body) => resolve({ err, response, body }));
        });
    }

    /**
     * Generates the anime reply message from MAL's data
     * @param {any} data The anime data
     * @param {DiscordClientMessageBase} message The reply message instance
     */
    generateAnime(data, message) {
        BotNeckPresets.createBase(message, {
            Title: 'MAL Anime',
            Thumbnail: {
                Url: data.image_url
            },
            Author: {
                Name: data.title,
                Url: data.url,
                IconUrl: 'https://vignette.wikia.nocookie.net/central/images/9/9a/Mal-icon.png/revision/latest?cb=20170415235719'
            },
            Description: data.synopsis,
            Url: data.url,
            Fields: [
                {
                    Name: 'English Title',
                    Value: (data.title_english == null ? 'None' : data.title_english),
                    Inline: true,
                },
                {
                    Name: 'Japanese Title',
                    Value: (data.title_japanese == null ? 'None' : data.title_japanese),
                    Inline: true,
                },
                {
                    Name: 'Type',
                    Value: (data.type == null ? 'None' : data.type),
                    Inline: true,
                },
                {
                    Name: 'Episodes',
                    Value: (data.episodes == null ? 'None' : data.episodes),
                    Inline: true,
                },
                {
                    Name: 'Status',
                    Value: (data.status == null ? 'None' : data.status),
                    Inline: true,
                },
                {
                    Name: 'Premiered',
                    Value: (data.premiered == null ? 'None' : data.premiered),
                    Inline: true,
                },
                {
                    Name: 'Score',
                    Value: (data.score == null ? 'None' : data.score.toString()),
                    Inline: true,
                },
                {
                    Name: 'Members',
                    Value: (data.members == null ? 'None' : data.members.toString()),
                    Inline: true,
                },
                {
                    Name: 'Aired',
                    Value: (data.aired.string == null ? 'None' : data.aired.string),
                    Inline: true,
                },
                {
                    Name: 'Duration',
                    Value: (data.duration == null ? 'None' : data.duration),
                    Inline: true,
                },
                {
                    Name: 'Rating',
                    Value: (data.rating == null ? 'None' : data.rating),
                }
            ]
        });
    }
    /**
     * Generates the manga reply message from MAL's data
     * @param {any} data The manga data
     * @param {DiscordClientMessageBase} message The reply message instance
     */
    generateManga(data, message) {
        BotNeckPresets.createBase(message, {
            Title: 'MAL MAL',
            Thumbnail: {
                Url: data.image_url
            },
            Author: {
                Name: data.title,
                Url: data.url,
                IconUrl: 'https://vignette.wikia.nocookie.net/central/images/9/9a/Mal-icon.png/revision/latest?cb=20170415235719'
            },
            Description: data.synopsis,
            Url: data.url,
            Fields: [
                {
                    Name: 'English Title',
                    Value: (data.title_english == null ? 'None' : data.title_english),
                    Inline: true,
                },
                {
                    Name: 'Japanese Title',
                    Value: (data.title_japanese == null ? 'None' : data.title_japanese),
                    Inline: true,
                },
                {
                    Name: 'Type',
                    Value: (data.type == null ? 'None' : data.type),
                    Inline: true,
                },
                {
                    Name: 'Volumes',
                    Value: (data.volumes == null ? 'None' : data.volumes),
                    Inline: true,
                },
                {
                    Name: 'Chapters',
                    Value: (data.chapters == null ? 'None' : data.chapters),
                    Inline: true,
                },
                {
                    Name: 'Status',
                    Value: (data.status == null ? 'None' : data.status),
                    Inline: true,
                },
                {
                    Name: 'Score',
                    Value: (data.score == null ? 'None' : data.score.toString()),
                    Inline: true,
                },
                {
                    Name: 'Members',
                    Value: (data.members == null ? 'None' : data.members.toString()),
                    Inline: true,
                },
                {
                    Name: 'Published',
                    Value: (data.published.string == null ? 'None' : data.published.string),
                    Inline: true,
                }
            ]
        });
    }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {
        let type = args[0].toLowerCase();
        let title = args[1];
        let index = 0;

        if(!this.APITypes.includes(type))
            return BotNeckPresets.createError(message, 'Only anime, manga, person and character allowed as type!');
        if(BotNeckCommand.getNumberOfArguments(args) > 2 && !isNaN(args[2]))
            index = Number(args[2]);

        BotNeckPresets.createInfo(message, 'Looking it up on MAL...');
        BotNeckClient.runAfterMessage(this.getMALList(this.APIUrl + 'search/' + type, title), ((dMessage, { err, response, body }) => {
            let replyMessage = new DiscordClientMessageBase();

            if(err || response.statusCode != 200) {
                BotNeckPresets.createError(replyMessage, 'Failed to send search request to MAL!');
                return dMessage.editMessage(replyMessage);
            }
            if(!body) {
                BotNeckPresets.createError(replyMessage, 'Failed to parse MAL data!');
                return dMessage.editMessage(replyMessage);
            }

            let id = body['results'][index]['mal_id'];
            this.getMALInfo(this.APIUrl + type + '/' + id)
            .then((({ err, response, body }) => {
                if(err || response.statusCode != 200) {
                    BotNeckPresets.createError(replyMessage, 'Failed to get anime/manga data!');
                    return dMessage.editMessage(replyMessage);
                }
                if(!body) {
                    BotNeckPresets.createError(replyMessage, 'Failed to parse MAL data!');
                    return dMessage.editMessage(replyMessage);
                }

                if(type === 'anime') this.generateAnime(body, replyMessage);
                else if(type === 'manga') this.generateManga(body, replyMessage);
                else BotNeckPresets.createError(replyMessage, 'Failed to use correct type');
                dMessage.editMessage(replyMessage);
            }).bind(this))
            .catch(err => {
                BotNeckPresets.createError(replyMessage, 'Failed to get anime/manga data!');
                BotNeckLog.error(err, 'Failed to get anime/manga data!');
                return dMessage.editMessage(replyMessage);
            });
        }).bind(this));
    }
}