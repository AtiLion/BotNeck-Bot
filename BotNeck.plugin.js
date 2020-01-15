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
	"lastBotMessageId": null,
	"messagePostEvent": []
}
const modules = {} // key: BotNeckModule

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

class BotNeck {
	getName() { return "BotNeck Bot"; }
	getDescription() { return "Adds selfbot commands to the Discord client."; }
	getVersion() { return "0.2.0"; }
	getAuthor() { return "AtiLion"; }

	load() {
		// Get paths
		this.modulesPath = BotNeckAPI.getModulesPath();
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
		BotNeckInternals.loadAllModules(err => {
			if(err) {
				console.error("Error while loading modules!");
				console.error(err);
				return;
			}

			console.log("All modules loaded!");
		});
	}

	start() {
		// Setup overrides
		XMLHttpRequest.prototype.open = function() {
			let result = openRequest.apply(this, [].slice.call(arguments));

			// Hook onload
			this.onload = function() {
				BotNeckInternals.getMessageId(this.responseText, this["automated"]);

				for(let func of [ ...protectedObject["messagePostEvent"] ]) {
					try {
						(function(responseText) {
							func(responseText);
						})(this.responseText);
					} catch(err) {
						console.log("Error while executing post event", err);
					}
					protectedObject["messagePostEvent"].splice(0, 1);
				}
			}

			return result;
		}
		XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
			if(header.toLowerCase() === "authorization" && !this["automated"])
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
	static getModulesPath() { return path.join(window.ContentManager.pluginsFolder, "BotNeckModules"); }

	static setAuthHeader(req, apiKey) {
		if(!modules[apiKey] || !modules[apiKey].permissions.includes("authorized_request"))
			return false;

		req["automated"] = true;
		req.setRequestHeader("Authorization", protectedObject["token"]);
		return true;
	}
	static nextMessagePost(func) {
		protectedObject["messagePostEvent"].push(func);
	}

	static generateError(error) {
		return {
			title: "BotNeck Error",
			type: "rich",
			description: error,
			color: 0xff6e00
		}
	}
	static getArgumentNumber(args) {
		if(typeof args !== "object")
			return 0;
		let counter = 0;

		for(let key in args)
			if(!isNaN(key))
				counter++;
		return counter;
	}
	static getArgumentsAsString(args) {
		let input = "";

		for(let i in args)
			input += args[i] + " ";
		return input;
	}
}
class BotNeckInternals {
	static getMessageId(response, isAutomated) {
		try {
			let parsed = JSON.parse(response);

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
			let { command, args } = BotNeckInternals.parseCommand(parsed["content"].substring(config.prefix.length));
			let mod = BotNeckInternals.getModuleByCommand(command);

			if(mod) {
				mod.sandbox.execute(parsed, args);
			}
			else if(command === "help") {
				parsed["embed"] = BotNeckInternals.generateHelp(args);
				delete parsed["content"];
			}
			else if(command === "usage") {
				parsed["embed"] = BotNeckInternals.generateUsage(args);
				delete parsed["content"];
			}
			else if(command === "reload") {
				parsed["embed"] = BotNeckInternals.generateReload(args);
				delete parsed["content"];
			}
			else {
				parsed["embed"] = BotNeckAPI.generateError(`Command *"${command}"* not found! Use the *help* command to see all commands!`);
				delete parsed["content"];
			}
			data = JSON.stringify(parsed);
		}
		return data;
	}
	static parseMessage(message) {
		try {
			let parsed = JSON.parse(message);

			if ((!parsed["content"] || typeof parsed["content"] !== "string") || 
				(!parsed["nonce"] || typeof parsed["nonce"] !== "string") || 
				(parsed["tts"] == null || typeof parsed["tts"] !== "boolean"))
					return null; // Invalid message structure

			return parsed;
		} catch(err) {
			return null;
		}
	}
	static parseCommand(content) {
		// Setup variables
		let broken = content.split(' ');
		let command = broken[0].trim();
		let builtArgs = broken.slice(1);
		let args = {}

		// Build args
		{
			let inValue = false;
			let name = null;
			let value = null;

			function pushArg(val) {
				args[name] = BotNeckInternals.buildArgType(val);
				name = null;
				value = null;
			}

			for(let arg of builtArgs) {
				if(!inValue && arg.includes('=')) { // key=value argument
					let brokenArg = arg.split('=');
					let builtValue = "";

					name = brokenArg[0];
					builtValue = arg.substring(name.length + 1);
					if(builtValue.startsWith('"')) { // It's a string
						if(builtValue.endsWith('"')) { // Single argument string
							pushArg(builtValue.substring(1, builtValue.length - 1));
							continue;
						}

						value = builtValue.substring(1);
						inValue = true;
						continue;
					}
					pushArg(builtValue);
				}
				else if(!inValue) { // lone argument
					name = Object.keys(args).length;
					if(arg.startsWith('"')) {
						if(arg.endsWith('"')) {
							pushArg(arg.substring(1, arg.length - 1));
							continue;
						}

						value = arg.substring(1);
						inValue = true;
						continue;
					}
					pushArg(arg);
				}
				else { // In the value
					if(arg.endsWith('"')) {
						value += " " + arg.substring(0, arg.length - 1);
						inValue = false;
						pushArg(value);
						continue;
					}

					value += " " + arg;
				}
			}
		}

		// Finish
		return { command, args }
	}
	static buildArgType(value) {
		if(!value || value === "")
			return false;
		if(isNaN(value))
			return value;
		return Number(value);
	}

	static generateHelp(args) {
		if(!args[0]) { // No command provided
			let help = [
				"help - Displays the description of all commands or one command",
				"usage - Displays the usage of all commands or one command",
				"reload - Reloads all the modules or one specific module"
			]
			for(let mod of Object.values(modules))
				help.push(`${mod.command} - ${mod.module.description ? mod.module.description : "No description!"}`);

			return {
				title: "BotNeck Help",
				type: "rich",
				description: help.join("\n"),
				color: 0x0061ff
			}
		}

		if(args[0] === "help") {
			return {
				title: "BotNeck Help",
				type: "rich",
				description: "help - Displays the description of all commands or one command",
				color: 0x0061ff
			}
		}
		else if(args[0] === "usage") {
			return {
				title: "BotNeck Help",
				type: "rich",
				description: "usage - Displays the usage of all commands or one command",
				color: 0x0061ff
			}
		}
		else if(args[0] === "reload") {
			return {
				title: "BotNeck Help",
				type: "rich",
				description: "reload - Reloads all the modules or one specific module",
				color: 0x0061ff
			}
		}
		else {
			let mod = BotNeckInternals.getModuleByCommand(args[0]);

			if(!mod)
				return BotNeckAPI.generateError(`Invalid command provided in help! *"${args[0]}"* does not exists!`);
			return {
				title: "BotNeck Help",
				type: "rich",
				description: `${mod.command} - ${mod.module.description ? mod.module.description : "No description!"}`,
				color: 0x0061ff
			}
		}
	}
	static generateUsage(args) {
		if(!args[0]) { // No command provided
			let usage = [
				"help - help *[command]*",
				"usage - usage *[command]*",
				"reload - reload *[command]*"
			]

			for(let mod of Object.values(modules))
				usage.push(`${mod.command} - ${mod.module.usage ? mod.module.usage : "No usage!"}`)

			return {
				title: "BotNeck Usage",
				type: "rich",
				description: usage.join("\n"),
				color: 0x0061ff
			}
		}

		if(args[0] === "help") {
			return {
				title: "BotNeck Usage",
				type: "rich",
				description: "help - help *[command]*",
				color: 0x0061ff
			}
		}
		else if(args[0] === "usage") {
			return {
				title: "BotNeck Usage",
				type: "rich",
				description: "usage - usage *[command]*",
				color: 0x0061ff
			}
		}
		else if(args[0] === "reload") {
			return {
				title: "BotNeck Usage",
				type: "rich",
				description: "reload - reload *[command]*",
				color: 0x0061ff
			}
		}
		else {
			let mod = BotNeckInternals.getModuleByCommand(args[0]);

			if(!mod)
				return BotNeckAPI.generateError(`Invalid command provided in usage! *"${args[0]}"* does not exists!`);
			return {
				title: "BotNeck Usage",
				type: "rich",
				description: `${mod.command} - ${mod.module.usage ? mod.module.usage : "No usage!"}`,
				color: 0x0061ff
			}
		}
	}
	static generateReload(args) {
		if(!args[0]) { // No command provided
			BotNeckInternals.loadAllModules(err => {
				if(err) {
					console.error("Error while reloading modules!");
					console.error(err);
					return;
				}

				console.log("All modules reloaded!");
			});

			return {
				title: "BotNeck Reload",
				type: "rich",
				description: "Modules have been reloaded!",
				color: 0x0061ff
			}
		}
		let mod = BotNeckInternals.getModuleByCommand(args[0]);

		if(!mod)
			return BotNeckAPI.generateError(`Invalid command provided in reload! *"${args[0]}"* does not exists!`);
		BotNeckInternals.loadModule(mod.name, err => {
			if(err) {
				console.error("Error while attempting to reload module ", name);
				console.error(err);
				return;
			}

			console.log("Module reloaded!");
		});
		return {
			title: "BotNeck Reload",
			type: "rich",
			description: "Module has been reloaded!",
			color: 0x0061ff
		}
	}

	static getModuleByCommand(command) {
		for(let mod of Object.values(modules))
			if(mod.command === command)
				return mod;
		return null;
	}

	static loadAllModules(func) {
		fs.readdir(BotNeckAPI.getModulesPath(), (err, files) => {
			if(err)
				return func(err);

			for(let filename of files) {
				if(filename.indexOf(".botneck.js") < 0)
					continue;
				let name = filename.slice(0, -(".botneck.js".length));

				BotNeckInternals.loadModule(name, err => {
					if(err) {
						console.error("Error while attempting to load module ", name);
						console.error(err);
						return;
					}

					console.log("Loaded module", name);
				});
			}

			func();
		});
	}
	static loadModule(name, func) {
		let file = path.join(BotNeckAPI.getModulesPath(), name + ".botneck.js");

		if(!fs.existsSync(file))
			return func("No such file/module found!");
		for(let key in modules) {
			if(modules[key].name === name) {
				console.log("Unloaded", name);
				delete modules[key];
				break;
			}
		}

		// Sandbox and execute
		fs.readFile(file, (err, data) => {
			if(err)
				return func(err);
			let apiKey = makeKey();

			// Push module
			BotNeckSandBox.build(data, apiKey, name);
			func();
		});
	}
	static addLoadedModule(sandbox) {
		// Run checks
		if(!sandbox.module.command || !sandbox.module.execute)
			return false;

		modules[sandbox.key] = new BotNeckModule(sandbox);
		return true;
	}
}
class BotNeckSandBox {
	constructor() {
		this.name = null;
		this.module = null;
		this.key = null;
	}

	static build(code, apiKey, name) {
		try {
			// Setup generated variables
			let generatedCode = "(function(){";

			// Add protections
			generatedCode += `let APIKey = "${apiKey}";`;

			// Add actual code
			generatedCode += "\n" + code + "\n";

			// Add sandbox execution
			generatedCode += `BotNeckSandBox.setup("${name}", "${apiKey}", new ${name}());`;

			// EOF
			generatedCode += "})()";

			// Execute
			eval(generatedCode);
		} catch(err) {
			console.error("Failed to load module", name);
			console.error(err);
		}
	}
	static setup(name, apiKey, mod) {
		let sandbox = new BotNeckSandBox();
		sandbox.name = name;
		sandbox.key = apiKey;
		sandbox.module = mod;

		if(BotNeckInternals.addLoadedModule(sandbox))
			console.log(`Added module ${name}!`);
		else
			console.log(`Failed to add module ${name}!`);
	}

	execute(message, args) {
		try {
			return this.module.execute(message, args);
		} catch(err) {
			console.error("Failed to execute module", this.name);
			console.error(err);
			return null;
		}
	}
}
class BotNeckModule {
	constructor(sandbox) {
		this.sandbox = sandbox;
		this.permissions = [...this.module.permissions];
	}

	get name() { return this.sandbox.name; }
	get module() { return this.sandbox.module; }
	get command() { return this.module.command; }
}
