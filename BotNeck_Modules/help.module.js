var help = function() {};

help.prototype.help = "Displays all commands and their help values or a help value for a single command! Usage: help [command]";
help.prototype.command = "help";

help.prototype.execute = function(msg, args)
{
  let emb = {
    title: "Help",
    type: "rich",
    description: "",
    color: 0x0061ff,
  };

  if(args.length > 0)
  {
    if(BotNeckModules.hasOwnProperty(args[0]))
    {
      if(typeof(BotNeckModules[args[0]].help) != "undefined")
      {
        emb["fields"] = [
          {
            name: args[0],
            value: BotNeckModules[args[0]].help,
          },
        ];
      }
      else
      {
        emb["description"] = "No help defined for " + args[0] + "!";
      }
    }
    else
    {
      emb["description"] = "No command " + args[0] + "!";
    }
  }
  else
  {
    emb["fields"] = [];
    for(let key in BotNeckModules)
    {
      if(typeof(BotNeckModules[key].help) == "undefined")
        continue;

      emb["fields"].push({
        name: key,
        value: BotNeckModules[key].help,
      });
    }
  }

  delete msg["content"];
  msg["embed"] = emb;
}
