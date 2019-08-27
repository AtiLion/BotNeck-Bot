var mal = function() {}

mal.search_url_anime = "https://myanimelist.net/search/prefix.json?type=anime&keyword=";
mal.search_url_manga = "https://myanimelist.net/search/prefix.json?type=manga&keyword=";
mal.api_url_anime = "https://api.jikan.me/anime/";
mal.api_url_manga = "https://api.jikan.me/manga/";

mal.prototype.command = "mal";
mal.prototype.minArgs = 2;
mal.prototype.help = "Gets information about an anime/manga. Usage: mal <anime/manga> <name>";

mal.prototype.execute = function(msg, args) {
    let type = (args[0].toLowerCase() == "anime" ? 1 : (args[0].toLowerCase() == "manga" ? 2 : 0)); // Neat
    let name = encodeURI(args.slice(1).join(" "));
    let embd = {
        title: "MyAnimeList information",
        type: "rich",
        color: 0x0061ff,
        description: "Loading please wait...",
    };

    if (type == 0) {
        embd["description"] = "Invalid type selection! Please select anime or manga as the first argument!";
    } else if (type == 1) {
        var request = require('request');

        var options = {
            url: mal.search_url_anime + name,
            headers: {
                'User-Agent': 'request'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);

                if (!data.hasOwnProperty("categories"))
                    embd["description"] = "Error in getting the anime/no anime found by that name!";
                if (data.categories.length < 1 || data.categories[0].items.length < 1)
                    embd["description"] = "No anime found with that name!";

                let sel = data.categories[0].items[0];

                if (sel.hasOwnProperty("id")) {
                    var options2 = {
                        url: mal.api_url_anime + sel.id,
                        headers: {
                            'User-Agent': 'request'
                        }
                    };

                    function callback2(error2, response2, body2) {

                        if (!error2 && response2.statusCode == 200) {
                            var data2 = JSON.parse(body2);
                            if (!data2.hasOwnProperty("mal_id"))
                                embd["description"] = "Error accessing the API!";

                            embd.thumbnail = {
                                url: data2.image_url,
                            };

                            embd.author = {
                                name: data2.title,
                                url: data2.link_canonical,
                                icon_url: "https://vignette.wikia.nocookie.net/central/images/9/9a/Mal-icon.png/revision/latest?cb=20170415235719",
                            };

                            embd.description = $("<textarea/>").html(data2.synopsis).text();
                            embd.url = data2.link_canonical;
                            embd.fields = [{
                                    name: "English Title",
                                    value: (data2.title_english == null ? "None" : data2.title_english),
                                    inline: true,
                                },
                                {
                                    name: "Japanese Title",
                                    value: (data2.title_japanese == null ? "None" : data2.title_japanese),
                                    inline: true,
                                },
                                {
                                    name: "Type",
                                    value: (data2.type == null ? "None" : data2.type),
                                    inline: true,
                                },
                                {
                                    name: "Episodes",
                                    value: (data2.episodes == null ? "None" : data2.episodes),
                                    inline: true,
                                },
                                {
                                    name: "Status",
                                    value: (data2.status == null ? "None" : data2.status),
                                    inline: true,
                                },
                                {
                                    name: "Premiered",
                                    value: (data2.premiered == null ? "None" : data2.premiered),
                                    inline: true,
                                },
                                {
                                    name: "Score",
                                    value: (data2.score == null ? "None" : data2.score.toString()),
                                    inline: true,
                                },
                                {
                                    name: "Members",
                                    value: (data2.members == null ? "None" : data2.members.toString()),
                                    inline: true,
                                },
                                {
                                    name: "Airing Time",
                                    value: (data2.aired.from == null ? "None" : data2.aired.from) + " - " + (data2.aired.to == null ? "On Going" : data2.aired.to),
                                    inline: true,
                                },
                                {
                                    name: "Duration",
                                    value: (data2.duration == null ? "None" : data2.duration),
                                    inline: true,
                                },
                                {
                                    name: "Rating",
                                    value: (data2.rating == null ? "None" : data2.rating),
                                },
                            ];
                            $.ajax({
                                type: "PATCH",
                                url: "https://discordapp.com/api/v6/channels/" + BotNeckAPI.GetCurrentChannelID() + "/messages/" + BotNeckAPI.GetLastMessageID(),
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify({
                                    embed: embd
                                }),
                                beforeSend: function(xhr) {
                                    xhr.setRequestHeader("Authorization", BotNeckAPI.GetDiscordToken());
                                },
                                success: function(data) {},
                                async: false,
                            });
                        }
                    }
                    request(options2, callback2);
                }
            }
        }

        request(options, callback);


    } else if (type == 2) {
        var request = require('request');

        var options = {
            url: mal.search_url_manga + name,
            headers: {
                'User-Agent': 'request'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);

                if (!data.hasOwnProperty("categories"))
                    embd["description"] = "Error in getting the manga/no manga found by that name!";
                if (data.categories.length < 1 || data.categories[0].items.length < 1)
                    embd["description"] = "No manga found with that name!";

                let sel = data.categories[0].items[0];

                if (sel.hasOwnProperty("id")) {
                    var options2 = {
                        url: mal.api_url_manga + sel.id,
                        headers: {
                            'User-Agent': 'request'
                        }
                    };

                    function callback2(error2, response2, body2) {
                        if (!error2 && response2.statusCode == 200) {
                            var data2 = JSON.parse(body2);
                            if (!data2.hasOwnProperty("mal_id"))
                                embd["description"] = "Error accessing the API!";

                            embd.thumbnail = {
                                url: data2.image_url,
                            };
                            embd.author = {
                                name: data2.title,
                                url: data2.link_canonical,
                                icon_url: "https://vignette.wikia.nocookie.net/central/images/9/9a/Mal-icon.png/revision/latest?cb=20170415235719",
                            };
                            embd.description = $("<textarea/>").html(data2.synopsis).text();
                            embd.url = data2.link_canonical;
                            embd.fields = [{
                                    name: "English Title",
                                    value: (data2.title_english == null ? "None" : data2.title_english),
                                    inline: true,
                                },
                                {
                                    name: "Japanese Title",
                                    value: (data2.title_japanese == null ? "None" : data2.title_japanese),
                                    inline: true,
                                },
                                {
                                    name: "Type",
                                    value: (data2.type == null ? "None" : data2.type),
                                    inline: true,
                                },
                                {
                                    name: "Status",
                                    value: (data2.status == null ? "None" : data2.status),
                                    inline: true,
                                },
                                {
                                    name: "Volumes",
                                    value: (data2.volumes == null ? "None" : data2.volumes),
                                    inline: true,
                                },
                                {
                                    name: "Chapters",
                                    value: (data2.chapters == null ? "None" : data2.chapters),
                                    inline: true,
                                },
                                {
                                    name: "Score",
                                    value: (data2.score == null ? "None" : data2.score.toString()),
                                    inline: true,
                                },
                                {
                                    name: "Members",
                                    value: (data2.members == null ? "None" : data2.members.toString()),
                                    inline: true,
                                },
                                {
                                    name: "Publishing Time",
                                    value: (data2.published.from == null ? "None" : data2.published.from) + " - " + (data2.published.to == null ? "On Going" : data2.published.to),
                                },
                            ];

                            $.ajax({
                                type: "PATCH",
                                url: "https://discordapp.com/api/v6/channels/" + BotNeckAPI.GetCurrentChannelID() + "/messages/" + BotNeckAPI.GetLastMessageID(),
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify({
                                    embed: embd
                                }),
                                beforeSend: function(xhr) {
                                    xhr.setRequestHeader("Authorization", BotNeckAPI.GetDiscordToken());
                                },
                                success: function(data) {},
                                async: false,
                            });
                        }
                    }
                    request(options2, callback2);
                }
            }
        }
        request(options, callback);
    }

    delete msg["content"];
    msg["embed"] = embd;
}
