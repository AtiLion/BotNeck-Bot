//META{"name":"BotNeck","website":"https://github.com/AtiLion/BotNeck-Bot","source":"https://github.com/AtiLion/BotNeck-Bot/blob/master/BotNeck.plugin.js"}*//

const fs = require("fs");
const path = require("path");

const sendRequest = XMLHttpRequest.prototype.send;
const setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
const openRequest = XMLHttpRequest.prototype.open;

const config = {
	"prefix": "->"
}
const protectedObject = { // Protected, do not expose to modules
	"token": null,
	"usedKeys": [],
	"lastUserMessageId": null,
	"lastBotMessageId": null
}
const modules = {} // key: { permissions: [ "permission" ], sandbox: sandbox, module: module }

/* Permissions:
 * - authorized_request = Create a request with your Discord token attached
*/

function makeKey() {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < 16; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	if(result in protectedObject["usedKeys"]) // Make sure there are no duplicates
		return makeKey();
	return result;
}
Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};

class BotNeck {
	getName() { return "BotNeck Bot"; }
	getDescription() { return "Adds selfbot commands to the Discord client."; }
	getVersion() { return "0.2.0"; }
	getAuthor() { return "AtiLion"; }

	load() {
		// Get paths
		this.modulesPath = path.join(window.ContentManager.pluginsFolder, "BotNeckModules");
		this.botneckConfig = path.join(window.bdConfig.dataPath, "BotNeck.config.json");

		// Load config
		if(fs.existsSync(this.botneckConfig)) {
			fs.readFile(this.botneckConfig, (err, data) => {
				if(err) {
					console.error("Error while reading configuration");
					console.error(err);
					return;
				}

				try {
					let parsed = JSON.parse(data);

					for(let key in config) {
						if(parsed[key])
							config[key] = parsed[key];
					}
				} catch(err) {
					console.error("Error while parsing configuration file");
					console.error(err);
					return;
				}
			});
		} else {
			fs.writeFile(this.botneckConfig, JSON.stringify(config), err => {
				if(err) {
					console.error("Failed to save configuration file");
					console.error(err);
				}
			});
		}

		// Load modules
		if(!fs.existsSync(this.modulesPath))
			fs.mkdirSync(this.modulesPath);
		fs.readdir(this.modulesPath, (err, files) => {
			if(err) {
				console.error("Error while getting modules!");
				console.error(err);
				return;
			}

			for(let filename of files) {
				if(filename.indexOf(".botneck.js") < 0)
					continue;
				let file = path.join(this.modulesPath, filename);
				let name = filename.slice(0, -(".botneck.js".length));

				// Sandbox and execute
				fs.readFile(file, (err, data) => {
					if(err) {
						console.error("Error while reading file", filename);
						console.error(err);
						return;
					}

					let sandbox = new BotNeckSandBox();
					sandbox.name = name;

					sandbox.execute(data);

					// Push module
					modules[makeKey()] = new BotNeckModule(sandbox);
					console.log("Loaded module", name);
				});
			}
		});
	}

	start() {
		// Setup overrides
		XMLHttpRequest.prototype.open = function() {
			let result = openRequest.apply(this, [].slice.call(arguments));

			// Hook onload
			this.onload = function() { BotNeckInternals.getMessageId(this.responseText, this["automated"]); }

			return result;
		}
		XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
			if(header.toLowerCase() === "authorization")
				protectedObject["token"] = value;

			return setRequestHeader.call(this, header, value);
		}
		XMLHttpRequest.prototype.send = function(data) {
			return sendRequest.call(this, BotNeckInternals.analyzeData(data));
		}
	}
	stop() {
		// Restore overrides
		XMLHttpRequest.prototype.setRequestHeader = setRequestHeader;
		XMLHttpRequest.prototype.send = sendRequest;
		XMLHttpRequest.prototype.open = openRequest;
	}
}
class BotNeckAPI {
	static getCurrentServerId() { return window.location.pathname.split("/")[2]; }
	static getCurrentChannelId() { return window.location.pathname.split("/")[3]; }
	static getLastUserMessageId() { return protectedObject["lastUserMessageId"]; }
	static getLastBotMessageId() { return protectedObject["lastBotMessageId"]; }
}
class BotNeckInternals {
	static getMessageId(response, isAutomated) {
		try {
			parsed = JSON.parse(response);

			if(parsed["id"]) {
				if(isAutomated)
					protectedObject["lastBotMessageId"] = parsed["id"];
				else
					protectedObject["lastUserMessageId"] = parsed["id"];
			}
		} catch(err) {}
	}
	static analyzeData(data) {
		let parsed = BotNeckInternals.parseMessage(data);
		if(parsed == null)
			return data;

		if(parsed["content"].startsWith(config.prefix)) {

		}
	}
	static parseMessage(message) {
		try {
			let parsed = JSON.parse(message);

			if ((!parsed["content"] || typeof parsed["content"] !== "string") || 
				(!parsed["nonce"] || typeof parsed["nonce"] !== "string") || 
				(!parsed["tts"] || typeof parsed["tts"] !== "boolean"))
					return null; // Invalid message structure

			return parsed;
		} catch(err) {
			return null;
		}
	}
}
class BotNeckSandBox {
	constructor() {
		this.name = null;
		this.module = null;
	}

	execute(code) {
		try {
			// Should prevent people from overriding stuff we don't want them to override
			let XMLHttpRequest = XMLHttpRequest.clone();
			let BotNeckAPI = BotNeckAPI.clone();
			let API = BotNeckAPI;

			eval(code);

			// Check if valid
			if(eval("typeof " + this.name) !== "function") {
				console.error("The provided module name is undefined or invalid!", this.name);
				return;
			}
			if(eval("typeof " + this.name + ".prototype.permissions") !== "array" ||
			   eval("typeof " + this.name + ".prototype.execute") !== "function" ||
			   eval("typeof " + this.name + ".prototype.command") !== "string") {
				console.error("Invalid structure of", this.name);
				return;
			}

			// Set data
			this.module = eval(this.name + ".prototype");
		} catch(err) {
			console.error("Failed to load module", this.name);
			console.error(err);
		}
	}
}
class BotNeckModule {
	constructor(sandbox) {
		this.sandbox = sandbox;
		this.module = this.sandbox.module;
		this.permissions = [...this.module.permissions];
	}
}
