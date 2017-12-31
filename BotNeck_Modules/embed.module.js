var embed = function() {};

embed.prototype.command = "embed";
embed.prototype.help = "Sends an embeded message based on paramaters. Usage: embed title='whatever' description='whatever'(Spaces are required between paramaters)";
embed.prototype.settings = {
  default: {
    title: "BotNeck Embed",
    type: "rich",
    description: "A simple BotNeck Embed",
    color: 0x0061ff,
    url: "https://github.com/AtiLion/BotNeck-Bot",
    timestamp: "now",
    footer: {
      text: "Simple footer in embed",
      icon_url: "",
    },
    image: {
      url: "",
      width: 0,
      height: 0,
    },
    thumbnail: {
      url: "",
      width: 0,
      height: 0,
    },
    video: {
      url: "",
      width: 0,
      height: 0,
    },
    provider: {
      name: "",
      url: "",
    },
    author: {
      name: "AtiLion",
      url: "https://github.com/AtiLion",
      icon_url: "https://avatars3.githubusercontent.com/u/20825809?s=460&v=4",
    },
  },
};

embed.prototype.execute = function(msg, args) // Warning: Extremely eye killing code. Do not read if sensitive to improper code formatting!
{
  let text = args.join(" ");
  let ld = BotNeckAPI.GetParameterValueFromText(text, "load");
  let embd = JSON.parse(JSON.stringify(ld != null && this.settings.hasOwnProperty(ld) ? this.settings[ld] : this.settings.default)) // Clone array
  let emb = {};

  let name = "";
  let value = "";
  let onValue = false;
  let isText = false;
  for(let i in text)
  {
    if(!onValue)
    {
      if(text[i] == "=")
        onValue = true;
      else
        name += text[i];
    }
    else
    {
      if(text[i] == '"')
        isText = !isText;
      else if(text[i] == " " && !isText)
      {
        onValue = false;
        isText = false;

        emb[name] = (isNaN(value) ? value : Number(value));
        name = "";
        value = "";
      }
      else
      {
        value += text[i];
      }
    }
  }
  if(value == "" && name != "")
  {
    value = name;
    name = "description";
  }
  emb[name] = (isNaN(value) ? value : Number(value));

  if(emb.hasOwnProperty("title"))
    embd.title = emb.title;
  if(emb.hasOwnProperty("type"))
    embd.type = emb.type;
  if(emb.hasOwnProperty("description"))
    embd.description = emb.description;
  if(emb.hasOwnProperty("color"))
    embd.color = emb.color;
  if(emb.hasOwnProperty("url"))
    embd.url = emb.url;
  if(emb.hasOwnProperty("timestamp"))
    embd.timestamp = emb.timestamp;
  if(emb.hasOwnProperty("footer_text"))
    embd.footer.text = emb.footer_text;
  if(emb.hasOwnProperty("footer_icon_url"))
    embd.footer.icon_url = emb.footer_icon_url;
  if(emb.hasOwnProperty("image_url"))
    embd.image.url = emb.image_url;
  if(emb.hasOwnProperty("image_width"))
    embd.image.width = emb.image_width;
  if(emb.hasOwnProperty("image_height"))
    embd.image.height = emb.image_height;
  if(emb.hasOwnProperty("thumbnail_url"))
    embd.thumbnail.url = emb.thumbnail_url;
  if(emb.hasOwnProperty("thumbnail_width"))
    embd.thumbnail.width = emb.thumbnail_width;
  if(emb.hasOwnProperty("thumbnail_height"))
    embd.thumbnail.height = emb.thumbnail_height;
  if(emb.hasOwnProperty("video_url"))
    embd.video.url = emb.video_url;
  if(emb.hasOwnProperty("video_width"))
    embd.video.width = emb.video_width;
  if(emb.hasOwnProperty("video_height"))
    embd.video.height = emb.video_height;
  if(emb.hasOwnProperty("provider_name"))
    embd.provider.name = emb.provider_name;
  if(emb.hasOwnProperty("provider_url"))
    embd.provider.url = emb.provider_url;
  if(emb.hasOwnProperty("author_name"))
    embd.author.name = emb.author_name;
  if(emb.hasOwnProperty("author_url"))
    embd.author.url = emb.author_url;
  if(emb.hasOwnProperty("author_icon_url"))
    embd.author.icon_url = emb.author_icon_url;

  if(emb.hasOwnProperty("save"))
  {
    this.settings[emb.save] = JSON.parse(JSON.stringify(embd));
    BotNeckAPI.SaveConfig();
  }
  if(embd.timestamp == "now")
    embd.timestamp = new Date().toISOString();
  else if(embd.timestamp != "")
    embd.timestamp = new Date(embd.timestamp).toISOString();
  let final = {};
  for(let e in embd)
  {
    if(embd[e] != "" && embd[e] != 0)
    {
      if(typeof(embd[e]) == "object")
      {
        final[e] = {};
        for(let i in embd[e])
        {
          if(embd[e][i] != "" && embd[e][i] != 0)
          {
            final[e][i] = embd[e][i];
          }
        }
        if(Object.keys(final[e]).length === 0)
          delete final[e];
      }
      else
      {
        final[e] = embd[e];
      }
    }
  }

  delete msg["content"];
  msg["embed"] = final;
};
