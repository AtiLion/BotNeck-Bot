const request = require('request');

class mal {
	constructor() {
		this.permissions = [ 'authorized_request' ];
		this.command = 'mal';
		this.description = 'Looks up a specific anime/manga';
		this.usage = 'mal [anime/manga] [search query] <index>';

		// MAL information
		this.api_url = 'https://api.jikan.moe/v3/';
		this.api_types = [ 'anime', 'manga' ]
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
            beforeSend: function(xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function(data) {},
        });
	}
	animeMessage(id, data, embed) {
		embed.thumbnail = {
            url: data.image_url,
        };

        embed.author = {
            name: data.title,
            url: data.url,
            icon_url: 'https://vignette.wikia.nocookie.net/central/images/9/9a/Mal-icon.png/revision/latest?cb=20170415235719',
        };

        embed.description = data.synopsis;
        embed.url = data.url;
        embed.fields = [{
                name: 'English Title',
                value: (data.title_english == null ? 'None' : data.title_english),
                inline: true,
            },
            {
                name: 'Japanese Title',
                value: (data.title_japanese == null ? 'None' : data.title_japanese),
                inline: true,
            },
            {
                name: 'Type',
                value: (data.type == null ? 'None' : data.type),
                inline: true,
            },
            {
                name: 'Episodes',
                value: (data.episodes == null ? 'None' : data.episodes),
                inline: true,
            },
            {
                name: 'Status',
                value: (data.status == null ? 'None' : data.status),
                inline: true,
            },
            {
                name: 'Premiered',
                value: (data.premiered == null ? 'None' : data.premiered),
                inline: true,
            },
            {
                name: 'Score',
                value: (data.score == null ? 'None' : data.score.toString()),
                inline: true,
            },
            {
                name: 'Members',
                value: (data.members == null ? 'None' : data.members.toString()),
                inline: true,
            },
            {
                name: 'Aired',
                value: (data.aired.string == null ? 'None' : data.aired.string),
                inline: true,
            },
            {
                name: 'Duration',
                value: (data.duration == null ? 'None' : data.duration),
                inline: true,
            },
            {
                name: 'Rating',
                value: (data.rating == null ? 'None' : data.rating),
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
            beforeSend: function(xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function(data) {},
        });
	}
	mangaMessage(id, data, embed) {
		embed.thumbnail = {
            url: data.image_url,
        };

        embed.author = {
            name: data.title,
            url: data.url,
            icon_url: 'https://vignette.wikia.nocookie.net/central/images/9/9a/Mal-icon.png/revision/latest?cb=20170415235719',
        };

        embed.description = data.synopsis;
        embed.url = data.url;
        embed.fields = [{
                name: 'English Title',
                value: (data.title_english == null ? 'None' : data.title_english),
                inline: true,
            },
            {
                name: 'Japanese Title',
                value: (data.title_japanese == null ? 'None' : data.title_japanese),
                inline: true,
            },
            {
                name: 'Type',
                value: (data.type == null ? 'None' : data.type),
                inline: true,
            },
            {
                name: 'Volumes',
                value: (data.volumes == null ? 'None' : data.volumes),
                inline: true,
            },
            {
                name: 'Chapters',
                value: (data.chapters == null ? 'None' : data.chapters),
                inline: true,
            },
            {
                name: 'Status',
                value: (data.status == null ? 'None' : data.status),
                inline: true,
            },
            {
                name: 'Score',
                value: (data.score == null ? 'None' : data.score.toString()),
                inline: true,
            },
            {
                name: 'Members',
                value: (data.members == null ? 'None' : data.members.toString()),
                inline: true,
            },
            {
                name: 'Published',
                value: (data.published.string == null ? 'None' : data.published.string),
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
            beforeSend: function(xhr) { BotNeckAPI.setAuthHeader(xhr, APIKey); },
            success: function(data) {},
        });
	}
	runAfterId(id, func) {
		if(!id) {
			BotNeckAPI.nextMessagePost(() => {
				func();
			})
		} else func();
	}

	execute(message, args) {
		// Remove content
		delete message['content'];

		// Validate input
		if(BotNeckAPI.getArgumentNumber(args) < 2)
			return message['embed'] = BotNeckAPI.generateError('You need at least 2 arguments for this command!');
		if(!this.api_types.includes(args[0]))
			return message['embed'] = BotNeckAPI.generateError('Only anime, manga, person and character allowed as type!');
		if(BotNeckAPI.getArgumentNumber(args) >= 3 && isNaN(args[2]))
			return message['embed'] = BotNeckAPI.generateError('The index requires to be a number!');

		// Create initial embed
		let embed = {
			title: 'MyAnimeList',
			type: 'rich',
			color: 0x0061ff,
			description: 'Loading please wait...'
		}
		message['embed'] = embed;

		// Setup data
		let messageId = null;
		let index = 0;

		// Grab message ID
		BotNeckAPI.nextMessagePost(() => {
			messageId = BotNeckAPI.getLastUserMessageId();
		});

		// Find index
		if(BotNeckAPI.getArgumentNumber(args) >= 3)
			index = Number(args[2]);

		// Create request options
		let options = {
			url: this.api_url + 'search/' + args[0],
			qs: {
				q: args[1],
				page: 1
			},
			json: true
		}

		// Do search request
		request(options, (error, response, body) => {
			// Handle errors
			if (error || response.statusCode != 200)
				return this.runAfterId(messageId, () => { this.errorMessage(messageId, 'Failed to send search request to MAL!'); });
			let id = body['results'][index]['mal_id'];

			// Modify request options
			delete options['qs'];
			options['url'] = this.api_url + args[0] + '/' + id;

			// Send request
			request(options, (error, response, body) => {
				// Handle errors
				if (error || response.statusCode != 200)
					return this.runAfterId(messageId, () => { this.errorMessage(messageId, 'Failed to send get request to MAL!'); });

				// Send result
				this.runAfterId(messageId, () => {
					if(args[0] === 'anime')
						this.animeMessage(messageId, body, embed);
					else if(args[0] === 'manga')
						this.mangaMessage(messageId, body, embed);
				});
			});
		});
	}
}
