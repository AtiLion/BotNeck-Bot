BotNeck Bot
==========
BotNeck Bot is a self-bot that is implemented into discord as a **BandagedDiscord** plugin. It is designed to be dynamic and easy to use. That means it is extremely easy to add your own commands to the bot without having to modify the code!

To use the bot you need to use the prefix "->" if you want to change the prefix you can change the configuration located it "BotNeckBot/config/BotNeck.json" file. You can also change it by using the prefix command.

----------

About
--------
BotNeck bot offers a unqiue approach to a self-bot as it has multiple modes it can handle.

The first mode is the "hook" mode, this mode allows you to use and execute commands before they are ever sent to Discord servers, this in turn prevents API spam or "automated message detection" and so it makes the self-bot less detectable by Discord.

The second mode is the standard mode, this acts equal to how normal self-bots work. When a command is sent the message is gotten by the client, the command is executed and the message is replaced by the command's output. This mode is only used when remote commands are enabled and the command is sent from another client that does not use BotNeck. Also keep in mind this is experimental, so it might not always work correctly.

BotNeck also contains lots of commands, and more are being added as time goes on, currently the best way to check for commands is with the "help" command. However I will make a list of all the commands soon.

----------

API
---
The API is easy to use, it uses JSDoc so you should be able to figure it out easily. I will be including documentation as soon as I can. But for now you can use the already made modules and the examples below.

**Example of module:**
```js
const { BotNeckModule, BotNeckClient, BotNeckCommand } = require('../BotNeckAPI');

module.exports = class ExampleModule extends BotNeckModule {
    constructor() {
        super();
    }

    get Name() { return 'Example Module'; }
    get Description() { return 'Example description'; }
    get Version() { return '1.0.0'; }
    get Author() { return 'AtiLion'; }

    onLoad() {}
    onUnload() {}
}
```

**Example of command:**
```js
const { 
    BotNeckCommand,
    DiscordAPI: {
        DiscordClientMessage
    }
} = require('../../BotNeckAPI');

module.exports = class ExampleCommand extends BotNeckCommand {
    get Command() { return 'example'; } // The command they need to type in to execute
    get Description() { return 'Example command description'; }
    get Usage() { return 'example <example required argument> [example optional argument]'; }

    /**
     * This function gets executed when the command is called
     * @param {DiscordClientMessage} message The message the client is trying to send
     * @param {any} args The arguments of the command
     */
    execute(message, args) {}
}
```

----------

How to install
--------------
 1. Download the ZIP file from the Releases section.
 2. Extract all folders and files from the ZIP file into your BetterDiscord plugins.
 3. Restart discord if you have it open.
 4. You are done!

----------

How to install a module
-----------------------
> **Warning**
> Some modules may do malicious things without your knowledge. It is highly recommended that you only use modules from a trusted source!

 1. Go to your BetterDiscord plugins folder.
 2. Inside the folder open the BotNeckBot/modules folder.
 3. Put the module folder/file into the directory
 4. Run the reload command
 5. And you are done!

 ----------

Credits
-----------------------
- [rauenzi](https://github.com/rauenzi) - [BDPluginLibrary](https://github.com/rauenzi/BDPluginLibrary)
