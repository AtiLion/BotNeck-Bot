//META{"name":"BotNeckPlugin"}*//

var BotNeckPlugin = function() {};
var BotNeckAPI = function() {};
var BotNeckModules = {};
var BotNeckData = {
	bdPath: "",
	botneckModules: "",
	botneckConfig: "",
	eWindow: null,
	Backup_Send: null,
};
var BotNeckConfig = {
	commandPrefix: "->",
};

const { remote, BrowserWindow } = require('electron');
const fs = require("fs");

BotNeckPlugin.config = "BotNeck";

BotNeckPlugin.prototype.onMessage = function() {};
BotNeckPlugin.prototype.onSwitch = function() {};
BotNeckPlugin.prototype.observer = function(e) {};

BotNeckPlugin.prototype.getSettingsPanel = function()
{
	return "";
};
BotNeckPlugin.prototype.getName = function()
{
    return "Bot Neck";
};
BotNeckPlugin.prototype.getDescription = function()
{
    return "A simple self-bot that runs as a plugin on your discord";
};
BotNeckPlugin.prototype.getVersion = function()
{
    return "0.1.0";
};
BotNeckPlugin.prototype.getAuthor = function()
{
    return "AtiLion";
};

BotNeckPlugin.prototype.start = function()
{
	BotNeckData.Backup_Send = XMLHttpRequest.prototype.send;

	(function(send) {
		XMLHttpRequest.prototype.send = function(data) {
			if(data != null)
			{
				let msg = JSON.parse(data);

				if(!msg.hasOwnProperty("content") || !msg.hasOwnProperty("nonce") || !msg.hasOwnProperty("tts"))
				{
					send.call(this, JSON.stringify(msg));
					return;
				}
				if(typeof(msg.content) != "string")
				{
					send.call(this, JSON.stringify(msg));
					return;
				}
				if(!msg.content.startsWith(BotNeckConfig.commandPrefix))
				{
					send.call(this, JSON.stringify(msg));
					return;
				}

				let fullcmd = msg.content.substring(2);
				if(fullcmd.startsWith(" "))
					fullcmd = fullcmd.substring(1);
				let spl = fullcmd.split(" ");
				let command = spl[0];
				let args = spl.slice(1);

				try
				{
					if(BotNeckModules.hasOwnProperty(command))
					{
						if(typeof(BotNeckModules[command].minArgs) == "number")
						{
							if(BotNeckModules[command].minArgs > args.length)
							{
								let emb = {
									title: "Bot Error",
									type: "rich",
									description: "Not enough arguments!",
									color: 0xff6e00,
								}

								delete msg["content"];
								msg["embed"] = emb;

								send.call(this, JSON.stringify(msg));
								return;
							}
						}
						BotNeckModules[command].execute(msg, args);
					}
					else
					{
						let emb = {
							title: "Bot Error",
							type: "rich",
							description: "No command " + command + " has been found!",
							color: 0xff6e00,
						}

						delete msg["content"];
						msg["embed"] = emb;
					}
				}
				catch (e)
				{
					let emb = {
						title: "Bot Error",
						type: "rich",
						description: "Error executing command " + command + "!",
						color: 0xff6e00,
					}

					delete msg["content"];
					msg["embed"] = emb;
					BotNeckAPI.LogError("Error executing command " + command, e);
				}
				send.call(this, JSON.stringify(msg));
				return;
			}
			send.call(this, data);
		};
	})(XMLHttpRequest.prototype.send);
};

BotNeckPlugin.prototype.stop = function()
{
	XMLHttpRequest.prototype.send = BotNeckData.Backup_Send;
};

BotNeckPlugin.prototype.load = function()
{
	BotNeckData.bdPath = (process.platform == 'win32' ? process.env.APPDATA : process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local') + '/BetterDiscord/';
	BotNeckData.botneckModules = BotNeckData.bdPath + "plugins/BotNeck_Modules"
	BotNeckData.botneckConfig = BotNeckData.bdPath + "plugins/" + BotNeckPlugin.config + ".json";
	BotNeckData.eWindow = remote.getCurrentWindow();

	if(!fs.existsSync(BotNeckData.botneckModules))
		fs.mkdirSync(BotNeckData.botneckModules);
	BotNeckAPI.LoadModules();
	BotNeckAPI.LoadConfig();
};

BotNeckPlugin.prototype.unload = function()
{
	BotNeckAPI.SaveConfig();
	BotNeckAPI.UnloadModules();
};
// ------------------------------------------------------ API ------------------------------------------------------------------ //

BotNeckAPI.Log = function(msg)
{
	console.log("[BOTNECK] " + msg);
};
BotNeckAPI.LogError = function(msg, ex)
{
	console.error("[BOTNECK_ERROR] " + msg)
	console.error(ex)
};

BotNeckAPI.LoadModules = function()
{
	fs.readdirSync(BotNeckData.botneckModules).forEach(function(filename)
	{
		if(!filename.endsWith(".module.js"))
			return;

		let module = fs.readFileSync(BotNeckData.botneckModules + "/" + filename, "utf-8");
		let name = filename.slice(0, -(".module.js".length));

		try
		{
			eval(module);
			eval("(function() { let mod = new " + name + "(); BotNeckModules[mod.command] = mod; BotNeckAPI.Log(mod.command + ' loaded!'); })();");
		}
		catch (e)
		{
			BotNeckAPI.LogError("Unable to load module: " + name, e);
		}
	});
};
BotNeckAPI.UnloadModules = function()
{
	BotNeckModules = {};
};
BotNeckAPI.LoadConfig = function()
{
	if(!fs.existsSync(BotNeckData.botneckConfig))
		return;

	let conf = fs.readFileSync(BotNeckData.botneckConfig, "utf-8");
	let cJson = JSON.parse(conf);

	for(let key in cJson)
	{
		if(!BotNeckModules.hasOwnProperty(key) && key != "BotNeck")
			continue;
		if(key != "BotNeck")
			if(typeof(BotNeckModules[key].settings) == "undefined")
				continue;

		for(let c in cJson[key])
		{
			if(key == "BotNeck")
				BotNeckConfig[c] = cJson[key][c];
			else
				BotNeckModules[key].settings[c] = cJson[key][c];
		}
	}
	BotNeckAPI.Log("Configuration loaded!");
}
BotNeckAPI.SaveConfig = function()
{
	if(fs.existsSync(BotNeckData.botneckConfig))
		fs.unlinkSync(BotNeckData.botneckConfig);

	let cfg = {};

	cfg["BotNeck"] = BotNeckConfig;
	for(let mod in BotNeckModules)
		if(typeof(BotNeckModules[mod].settings) != "undefined")
			cfg[mod] = BotNeckModules[mod].settings;
	fs.writeFileSync(BotNeckData.botneckConfig, JSON.stringify(cfg))
}

BotNeckAPI.GetCurrentServerID = function()
{
	return window.location.pathname.split("/")[2];
};
BotNeckAPI.GetCurrentChannelID = function()
{
	return window.location.pathname.split("/")[3];
};
BotNeckAPI.GetDiscordToken = function() // WARNING: This uses an exploit in the iframe of electron. Use with caution!!
{
	let elem = document.createElement("iframe");
	let token = document.body.appendChild(elem).contentWindow.localStorage.token.substring(1).slice(0, -1);

	document.body.removeChild(elem);
	return token;
};

BotNeckAPI.GetParameterValueFromText = function(text, parameterKey)
{
	let i = text.indexOf(parameterKey + "=");
	if(i === -1)
		return null;

	let txt = text.substring(i + (parameterKey + "=").length);
	let value = "";

	if(txt.startsWith('"')) // Safe to assume it is a string
	{
		let ind = 1; // 1 to skip the "

		while(ind < txt.length && txt[ind] != '"') // Loop until we hit the end of the text or until we hit a "
		{
			value += txt[ind];
			ind++;
		}
	}
	else // Not a string
	{
		let ind = 0; // Start from 0

		while(ind < txt.length && txt[ind] != ' ') // Loop until we hit the end of the text or until we hit a space
		{
			value += txt[ind];
			ind++;
		}
	}

	return value;
};
