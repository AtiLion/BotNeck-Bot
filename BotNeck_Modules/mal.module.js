var mal = function() {}

mal.search_url_anime = "https://myanimelist.net/search/prefix.json?type=anime&keyword=";
mal.search_url_manga = "https://myanimelist.net/search/prefix.json?type=manga&keyword=";
mal.api_url_anime = "https://api.jikan.me/anime/";
mal.api_url_manga = "https://api.jikan.me/manga/";
mal.proxy = "https://cors-anywhere.herokuapp.com/";

mal.prototype.command = "mal";
mal.prototype.minArgs = 2;
mal.prototype.help = "Gets information about an anime/manga. Usage: mal <anime/manga> <name>";

mal.prototype.execute = function(msg, args)
{
  let type = (args[0].toLowerCase() == "anime" ? 1 : (args[0].toLowerCase() == "manga" ? 2 : 0)); // Neat
  let name = encodeURI(args.slice(1).join(" "));
  let embd = {
    title: "MyAnimeList information",
    type: "rich",
    color: 0x0061ff,
    description: "Loading please wait...",
  };

  if(type == 0)
  {
    embd["description"] = "Invalid type selection! Please select anime or manga as the first argument!";
  }
  else if(type == 1)
  {
    $.ajax({
      type: "GET",
      url: mal.proxy + mal.search_url_anime + name,
      dataType: "json",
      success: function(data)
      {
        if(!data.hasOwnProperty("categories"))
          embd["description"] = "Error in getting the anime/no anime found by that name!";
        if(data.categories.length < 1 || data.categories[0].items.length < 1)
          embd["description"] = "No anime found with that name!";

        let sel = data.categories[0].items[0];

        if(sel.hasOwnProperty("id"))
        {
          $.ajax({
            type: "GET",
            url: mal.proxy + mal.api_url_anime + sel.id,
            dataType: "json",
            success: function(data)
            {
              if(!data.hasOwnProperty("mal_id"))
                embd["description"] = "Error accessing the API!";

              embd.thumbnail = {
                url: data.image_url,
              };
              embd.author = {
                name: data.title,
                url: data.link_canonical,
                icon_url: "https://vignette.wikia.nocookie.net/central/images/9/9a/Mal-icon.png/revision/latest?cb=20170415235719",
              };
              embd.description = data.synopsis;
              embd.url = data.link_canonical;
              embd.fields = [
                {
                  name: "English Title",
                  value: (data.title_english == null ? "None" : data.title_english),
                  inline: true,
                },
                {
                  name: "Japanese Title",
                  value: (data.title_japanese == null ? "None" : data.title_japanese),
                  inline: true,
                },
                {
                  name: "Type",
                  value: (data.type == null ? "None" : data.type),
                  inline: true,
                },
                {
                  name: "Episodes",
                  value: (data.episodes == null ? "None" : data.episodes),
                  inline: true,
                },
                {
                  name: "Status",
                  value: (data.status == null ? "None" : data.status),
                  inline: true,
                },
                {
                  name: "Premiered",
                  value: (data.premiered == null ? "None" : data.premiered),
                  inline: true,
                },
                {
                  name: "Score",
                  value: (data.score == null ? "None" : data.score.toString()),
                  inline: true,
                },
                {
                  name: "Members",
                  value: (data.members == null ? "None" : data.members.toString()),
                  inline: true,
                },
                {
                  name: "Airing Time",
                  value: (data.aired.from == null ? "None" : data.aired.from) + " - " + (data.aired.to == null ? "On Going" : data.aired.to),
                  inline: true,
                },
                {
                  name: "Duration",
                  value: (data.duration == null ? "None" : data.duration),
                  inline: true,
                },
                {
                  name: "Rating",
                  value: (data.rating == null ? "None" : data.rating),
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
                beforeSend: function (xhr)
                {
                  xhr.setRequestHeader("Authorization", BotNeckAPI.GetDiscordToken());
                },
                success: function(data)
                {
                },
                async: false,
              });
            },
          });
        }
      },
    });
  }
  else if(type == 2)
  {
    $.ajax({
      type: "GET",
      url: mal.proxy + mal.search_url_manga + name,
      dataType: "json",
      success: function(data)
      {
        if(!data.hasOwnProperty("categories"))
          embd["description"] = "Error in getting the manga/no manga found by that name!";
        if(data.categories.length < 1 || data.categories[0].items.length < 1)
          embd["description"] = "No manga found with that name!";

        let sel = data.categories[0].items[0];

        if(sel.hasOwnProperty("id"))
        {
          $.ajax({
            type: "GET",
            url: mal.proxy + mal.api_url_manga + sel.id,
            dataType: "json",
            success: function(data)
            {
              if(!data.hasOwnProperty("mal_id"))
                embd["description"] = "Error accessing the API!";

              embd.thumbnail = {
                url: data.image_url,
              };
              embd.author = {
                name: data.title,
                url: data.link_canonical,
                icon_url: "https://vignette.wikia.nocookie.net/central/images/9/9a/Mal-icon.png/revision/latest?cb=20170415235719",
              };
              embd.description = data.synopsis;
              embd.url = data.link_canonical;
              embd.fields = [
                {
                  name: "English Title",
                  value: (data.title_english == null ? "None" : data.title_english),
                  inline: true,
                },
                {
                  name: "Japanese Title",
                  value: (data.title_japanese == null ? "None" : data.title_japanese),
                  inline: true,
                },
                {
                  name: "Type",
                  value: (data.type == null ? "None" : data.type),
                  inline: true,
                },
                {
                  name: "Status",
                  value: (data.status == null ? "None" : data.status),
                  inline: true,
                },
                {
                  name: "Volumes",
                  value: (data.volumes == null ? "None" : data.volumes),
                  inline: true,
                },
                {
                  name: "Chapters",
                  value: (data.chapters == null ? "None" : data.chapters),
                  inline: true,
                },
                {
                  name: "Score",
                  value: (data.score == null ? "None" : data.score.toString()),
                  inline: true,
                },
                {
                  name: "Members",
                  value: (data.members == null ? "None" : data.members.toString()),
                  inline: true,
                },
                {
                  name: "Publishing Time",
                  value: (data.published.from == null ? "None" : data.published.from) + " - " + (data.published.to == null ? "On Going" : data.published.to),
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
                beforeSend: function (xhr)
                {
                  xhr.setRequestHeader("Authorization", BotNeckAPI.GetDiscordToken());
                },
                success: function(data)
                {
                },
                async: false,
              });
            },
          });
        }
      },
    });
  }

  delete msg["content"];
  msg["embed"] = embd;
}
