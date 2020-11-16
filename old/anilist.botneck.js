const request = require('request');

const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Oct', 'Nov', 'Dec'];

class anilist {
    constructor() {
        this.permissions = ['authorized_request'];
        this.command = 'anilist';
        this.description = 'Looks up a specific anime/manga';
        this.usage = 'anilist [anime/manga] [search query]';

        // MAL information
        this.api_url = 'https://graphql.anilist.co';
        this.api_types = ['anime', 'manga']
    }

    convertToDate(dateObj) {
        return Months[dateObj.month] + ' ' + dateObj.day.toString() + ', ' + dateObj.year.toString();
    }
    stripHTML(html) {
        let tmpDiv = document.createElement('div');

        tmpDiv.innerHTML = html;
        return tmpDiv.innerText;
    }

    errorMessage(id, message) {
        $.ajax({
            type: 'PATCH',
            url: 'https://discordapp.com/api/v6/channels/' + BotNeckAPI.getCurrentChannelId() + '/messages/' + id,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                embed: BotNeckAPI.generateError(message)
            }),
            beforeSend: function (xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function (data) { },
        });
    }
    animeMessage(id, data, embed) {
        embed.thumbnail = {
            url: data.coverImage.medium,
        };

        embed.author = {
            name: data.title.romaji,
            url: data.siteUrl,
            icon_url: 'https://anilist.co/img/icons/favicon-32x32.png',
        };

        embed.description = this.stripHTML(data.description);
        embed.url = data.siteUrl;
        embed.fields = [
            {
                name: 'English Title',
                value: (data.title.english == null ? 'None' : data.title.english),
                inline: true,
            },
            {
                name: 'Native Title',
                value: (data.title.native == null ? 'None' : data.title.native),
                inline: true,
            },
            {
                name: 'Format',
                value: (data.format == null ? 'None' : data.format),
                inline: true,
            },
            {
                name: 'Episodes',
                value: (data.episodes == null ? 'None' : data.episodes.toString()),
                inline: true,
            },
            {
                name: 'Status',
                value: (data.status == null ? 'None' : data.status),
                inline: true,
            },
            {
                name: 'Mean Score',
                value: (data.meanScore == null ? 'None' : data.meanScore.toString()),
                inline: true,
            },
            {
                name: 'Average Score',
                value: (data.averageScore == null ? 'None' : data.averageScore.toString()),
                inline: true,
            },
            {
                name: 'Popularity',
                value: (data.popularity == null ? 'None' : data.popularity.toString()),
                inline: true,
            },
            {
                name: 'Aired',
                value: (data.startDate.day == null ? 'None' : this.convertToDate(data.startDate)),
                inline: true,
            },
            {
                name: 'Duration',
                value: (data.duration == null ? 'None' : data.duration.toString() + ' min'),
                inline: true,
            },
            {
                name: 'Adult',
                value: (data.isAdult ? 'Yes' : 'No'),
            }
        ];

        $.ajax({
            type: 'PATCH',
            url: 'https://discordapp.com/api/v6/channels/' + BotNeckAPI.getCurrentChannelId() + '/messages/' + id,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                embed
            }),
            beforeSend: function (xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function (data) { },
        });
    }
    mangaMessage(id, data, embed) {
        embed.thumbnail = {
            url: data.coverImage.medium,
        };

        embed.author = {
            name: data.title.romaji,
            url: data.siteUrl,
            icon_url: 'https://anilist.co/img/icons/favicon-32x32.png',
        };

        embed.description = this.stripHTML(data.description);
        embed.url = data.siteUrl;
        embed.fields = [
            {
                name: 'English Title',
                value: (data.title.english == null ? 'None' : data.title.english),
                inline: true,
            },
            {
                name: 'Native Title',
                value: (data.title.native == null ? 'None' : data.title.native),
                inline: true,
            },
            {
                name: 'Format',
                value: (data.format == null ? 'None' : data.format),
                inline: true,
            },
            {
                name: 'Volumes',
                value: (data.volumes == null ? 'None' : data.volumes.toString()),
                inline: true,
            },
            {
                name: 'Chapters',
                value: (data.chapters == null ? 'None' : data.chapters.toString()),
                inline: true,
            },
            {
                name: 'Status',
                value: (data.status == null ? 'None' : data.status),
                inline: true,
            },
            {
                name: 'Mean Score',
                value: (data.meanScore == null ? 'None' : data.meanScore.toString()),
                inline: true,
            },
            {
                name: 'Average Score',
                value: (data.averageScore == null ? 'None' : data.averageScore.toString()),
                inline: true,
            },
            {
                name: 'Popularity',
                value: (data.popularity == null ? 'None' : data.popularity.toString()),
                inline: true,
            },
            {
                name: 'Published',
                value: (data.startDate.day == null ? 'None' : this.convertToDate(data.startDate)),
                inline: true,
            }
        ];

        $.ajax({
            type: 'PATCH',
            url: 'https://discordapp.com/api/v6/channels/' + BotNeckAPI.getCurrentChannelId() + '/messages/' + id,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                embed
            }),
            beforeSend: function (xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function (data) { },
        });
    }
    runAfterId(id, func) {
        if (!id) {
            BotNeckAPI.nextMessagePost(() => {
                func();
            })
        } else func();
    }

    execute(message, args) {
        // Remove content
        delete message['content'];

        // Validate input
        if (BotNeckAPI.getArgumentNumber(args) < 2)
            return message['embed'] = BotNeckAPI.generateError('You need at least 2 arguments for this command!');
        if (!this.api_types.includes(args[0]))
            return message['embed'] = BotNeckAPI.generateError('Only anime, manga, person and character allowed as type!');

        // Create initial embed
        let embed = {
            title: 'AniList',
            type: 'rich',
            color: 0x0061ff,
            description: 'Loading please wait...'
        }
        message['embed'] = embed;

        // Setup data
        let messageId = null;

        // Grab message ID
        BotNeckAPI.nextMessagePost(() => {
            messageId = BotNeckAPI.getLastUserMessageId();
        });

        // Setup query + variables
        let variables = {
            title: args[1]
        }
        let query = `
        query($title: String) {
            Media(search: $title, type: ${args[0].toLowerCase() === 'anime' ? 'ANIME' : 'MANGA'}) {
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

        // Create request options
        let options = {
            url: this.api_url,
            method: 'POST',
            body: {
                query: query,
                variables: variables
            },
            json: true
        }

        // Do search request
        request(options, (error, response, body) => {
            // Handle errors
            if (error || response.statusCode != 200)
                return this.runAfterId(messageId, () => { this.errorMessage(messageId, 'Failed to send search request to AniList!'); });
            if (!body || !body.data || !body.data.Media)
                return this.runAfterId(messageId, () => { this.errorMessage(messageId, 'Failed to parse AniList data!'); });

            // Display
            this.runAfterId(messageId, () => {
                if (args[0].toLowerCase() === 'anime')
                    this.animeMessage(messageId, body.data.Media, embed);
                else if (args[0].toLowerCase() === 'manga')
                    this.mangaMessage(messageId, body.data.Media, embed);
            });
        });
    }
}
