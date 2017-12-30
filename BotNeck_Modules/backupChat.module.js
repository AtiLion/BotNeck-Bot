var backupChat = function() {};

backupChat.prototype.command = "backup";
backupChat.prototype.minArgs = 2;
backupChat.prototype.help = "Backs up the specified amount of chat into a file. Usage: backup <amount of messages> <file name>";

backupChat.prototype.execute = function(msg, args)
{
  $.ajax({
    type: "GET",
    url: "https://discordapp.com/api/v6/channels/" + BotNeckAPI.GetCurrentChannelID() + "/messages?limit=" + args[0],
    dataType: "json",
    contentType: "application/json",
    beforeSend: function (xhr)
    {
      xhr.setRequestHeader("Authorization", BotNeckAPI.GetDiscordToken());
    },
    success: function(data)
    {
      let chatBackup = BotNeckData.bdPath + "Chat_Backup";

      if(!fs.existsSync(chatBackup))
        fs.mkdirSync(chatBackup);

      console.log(data);
      let chat = data; // Too lazy to replace
      let save = "";
      for(let i in chat)
      {
        if(!chat[i].hasOwnProperty("content") || chat[i].content == "")
          continue;
        let msg = chat[i].author.username + "#" + chat[i].author.discriminator + ": " + chat[i].content;

        save += msg;
        save += "\n";
      }

      if(fs.existsSync(chatBackup + "/" + args[1] + ".log"))
        fs.unlinkSync(chatBackup + "/" + args[1] + ".log");
      fs.writeFileSync(chatBackup + "/" + args[1] + ".log", save);
    },
    async: false,
  });

  let emb = {
		title: "Chat Backup",
		type: "rich",
		description: "Chat backed up successfully!",
		color: 0x0061ff,
	};

	delete msg["content"];
	msg["embed"] = emb;
}
