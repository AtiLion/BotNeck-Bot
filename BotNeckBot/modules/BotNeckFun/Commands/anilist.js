const request = require('request');
const { 
    BotNeckCommand,
    BotNeckClient,
    BotNeckPresets,
    DiscordAPI: {
        DiscordClientMessage,
        DiscordClientMessageBase
    }
} = require('../../BotNeckAPI');

module.exports = class AniListCommand extends BotNeckCommand {
    get Command() { return 'anilist'; }
    get Description() { return 'Looks up a specific anime/manga'; }
    get Usage() { return 'anilist <anime/manga> <search query>'; }
    get MinimumArguments() { return 2; }

    get APIUrl() { return 'https://graphql.anilist.co'; }
    get APITypes() { return ['anime', 'manga']; }
    get Months() { return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Oct', 'Nov', 'Dec']; }

    /**
     * Converts AniList date object to string
     * @param {any} dateObj AniList date object
     * @returns {String} AniList date object as a string
     */
    convertToDate(dateObj) {
        return this.Months[dateObj.month] + ' ' + dateObj.day.toString() + ', ' + dateObj.year.toString();
    }
    /**
     * Extracts the text from an HTML string
     * @param {String} html The HTML string
     * @returns {String} The output text without HTML
     */
    stripHTML(html) {
        let tmpDiv = document.createElement('div');

        tmpDiv.innerHTML = html;
        return tmpDiv.innerText;
    }

    /**
     * Gets AniList information on anime/manga of a specific title
     * @param {String} type The type to search for (anime/manga)
     * @param {String} title the title of the anime/manga
     * @returns {Promise} Request output
     */
    getAniListInfo(url, type, title) {
        return new Promise((resolve) => {
            let variables = {
                title
            }
            let query = `
            query($title: String) {
                Media(search: $title, type: ${type === 'anime' ? 'ANIME' : 'MANGA'}) {
                    title {
                        romaji,
                        english,
                        native
                    },
                    format,
                    volumes,
                    chapters,
                    episodes,
                    status,
                    meanScore,
                    averageScore,
                    popularity,
                    startDate {
                        year,
                        month,
                        day
                    }
                    duration,
                    isAdult,
                    coverImage {
                        medium
                    },
                    siteUrl,
                    description
                }
            }`;
            let options = {
                url: url,
                method: 'POST',
                body: {
                    query: query,
                    variables: variables
                },
                json: true
            }
            request(options, (err, response, body) => resolve({ err, response, body }));
        });
    }

    /**
     * Generates the anime reply message from AniList's data
     * @param {any} data The anime data
     * @param {DiscordClientMessageBase} message The reply message instance
     */
    generateAnime(data, message) {
        BotNeckPresets.createBase(message, {
            Title: 'AniList Anime',
            Thumbnail: {
                Url: data.coverImage.medium
            },
            Author: {
                Name: data.title.romaji,
                Url: data.siteUrl,
                IconUrl: 'https://anilist.co/img/icons/favicon-32x32.png'
            },
            Description: this.stripHTML(data.description),
            Url: data.siteUrl,
            Fields: [
                {
                    Name: 'English Title',
                    Value: (data.title.english == null ? 'None' : data.title.english),
                    Inline: true
                },
                {
                    Name: 'Native Title',
                    Value: (data.title.native == null ? 'None' : data.title.native),
                    Inline: true
                },
                {
                    Name: 'Format',
                    Value: (data.format == null ? 'None' : data.format),
                    Inline: true
                },
                {
                    Name: 'Episodes',
                    Value: (data.episodes == null ? 'None' : data.episodes.toString()),
                    Inline: true
                },
                {
                    Name: 'Status',
                    Value: (data.status == null ? 'None' : data.status),
                    Inline: true
                },
                {
                    Name: 'Mean Score',
                    Value: (data.meanScore == null ? 'None' : data.meanScore.toString()),
                    Inline: true
                },
                {
                    Name: 'Average Score',
                    Value: (data.averageScore == null ? 'None' : data.averageScore.toString()),
                    Inline: true,
                },
                {
                    Name: 'Popularity',
                    Value: (data.popularity == null ? 'None' : data.popularity.toString()),
                    Inline: true,
                },
                {
                    Name: 'Aired',
                    Value: (data.startDate.day == null ? 'None' : this.convertToDate(data.startDate)),
                    Inline: true,
                },
                {
                    Name: 'Duration',
                    Value: (data.duration == null ? 'None' : data.duration.toString() + ' min'),
                    Inline: true,
                },
                {
                    Name: 'Adult',
                    Value: (data.isAdult ? 'Yes' : 'No'),
                }
            ]
        });
    }
    /**
     * Generates the manga reply message from AniList's data
     * @param {any} data The manga data
     * @param {DiscordClientMessageBase} message The reply message instance
     */
    generateManga(data, message) {
        BotNeckPresets.createBase(message, {
            Title: 'AniList Manga',
            Thumbnail: {
                Url: data.coverImage.medium
            },
            Author: {
                Name: data.title.romaji,
                Url: data.siteUrl,
                IconUrl: 'https://anilist.co/img/icons/favicon-32x32.png'
            },
            Description: this.stripHTML(data.description),
            Url: data.siteUrl,
            Fields: [
                {
                    Name: 'English Title',
                    Value: (data.title.english == null ? 'None' : data.title.english),
                    Inline: true,
                },
                {
                    Name: 'Native Title',
                    Value: (data.title.native == null ? 'None' : data.title.native),
                    Inline: true,
                },
                {
                    Name: 'Format',
                    Value: (data.format == null ? 'None' : data.format),
                    Inline: true,
                },
                {
                    Name: 'Volumes',
                    Value: (data.volumes == null ? 'None' : data.volumes.toString()),
                    Inline: true,
                },
                {
                    Name: 'Chapters',
                    Value: (data.chapters == null ? 'None' : data.chapters.toString()),
                    Inline: true,
                },
                {
                    Name: 'Status',
                    Value: (data.status == null ? 'None' : data.status),
                    Inline: true,
                },
                {
                    Name: 'Mean Score',
                    Value: (data.meanScore == null ? 'None' : data.meanScore.toString()),
                    Inline: true,
                },
                {
                    Name: 'Average Score',
                    Value: (data.averageScore == null ? 'None' : data.averageScore.toString()),
                    Inline: true,
                },
                {
                    Name: 'Popularity',
                    Value: (data.popularity == null ? 'None' : data.popularity.toString()),
                    Inline: true,
                },
                {
                    Name: 'Published',
                    Value: (data.startDate.day == null ? 'None' : this.convertToDate(data.startDate)),
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

        if(!this.APITypes.includes(type))
            return BotNeckPresets.createError(message, 'Only anime, manga, person and character allowed as type!');

        BotNeckPresets.createInfo(message, 'Looking it up on AniList...');
        BotNeckClient.runAfterMessage(this.getAniListInfo(this.APIUrl, type, title), ((dMessage, { err, response, body }) => {
            let replyMessage = new DiscordClientMessageBase();

            if(err || response.statusCode != 200) {
                BotNeckPresets.createError(replyMessage, 'Failed to send search request to AniList!');
                return dMessage.editMessage(replyMessage);
            }
            if(!body || !body.data || !body.data.Media) {
                BotNeckPresets.createError(replyMessage, 'Failed to parse AniList data!');
                return dMessage.editMessage(replyMessage);
            }

            if(type === 'anime') this.generateAnime(body.data.Media, replyMessage);
            else if(type === 'manga') this.generateManga(body.data.Media, replyMessage);
            else BotNeckPresets.createError(replyMessage, 'Failed to use correct type');
            dMessage.editMessage(replyMessage);
        }).bind(this));
    }
}