var reload = function() {};

reload.prototype.command = "reload";
reload.prototype.help = "Reloads all the modules for the bot! Usage: reload";

reload.prototype.execute = function(msg)
{
  try
  {
    BotNeckAPI.UnloadModules();
    BotNeckAPI.LoadModules();

    let emb = {
      title: "BotNeck Reloader",
      type: "rich",
      description: "BotNeck modules reloaded successfully!",
      color: 0x11c101,
    };
    delete msg["content"];
    msg["embed"] = emb;
  }
  catch (e)
  {
    let emb = {
      title: "BotNeck Reloader",
      type: "rich",
      description: "BotNeck modules failed to reload!",
      color: 0xc10101,
      fields: [
        {
          name: "Error",
          value: e,
        },
      ],
    };
    delete msg["content"];
    msg["embed"] = emb;
  }
}
