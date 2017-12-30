BotNeck Bot
==========
BotNeck Bot is a self-bot that is implemented into discord as a **BetterDiscord** plugin. It is designed to be dynamic and easy to use. That means it is extremely easy to add your own commands to the bot without having to modify the code!

----------

Features
--------

BotNeck Bot offers lots of already built in commands such as:

 - Magic 8ball
 - Calculator
 - Random choice chooser
 - Text flipper
 - Help
 - Lenny face
 - Lmgtfy link generator
 - Love calculator
 - Text to regional text
 - Easy module/command reloader
 - Roll a dice
 - Backup/Save the chat
 - Create custom embeds(does not support fields)

It also has features good for developers such as:

 - Quick reloading of modules(good for debugging)
 - Quick error display in message
 - Easy to use message editor
 - Basic API(Not finished)
 - Integrated and easy to use configuration

BotNeck is also special as it uses a send hook to capture the message before it is ever sent to the server. That means the message is never edited or deleted from the server and is instead captured, modified and sent to the server. This will in turn prevent spamming of messages for users on the server.
I am also working on adding more features and commands as time goes on.


----------

API(Not finished)
---

 - BotNeckAPI.Log(message) = This will log a message to the console for debugging.
 - BotNeckAPI.LogError(message, exception) = This will log an error and the exception to the console
 - BotNeckAPI.LoadModules() = This will load all the modules in the BotNeck_Modules directory
 - BotNeckAPI.UnloadModules() = This will unload all the modules that are loaded
 - BotNeckAPI.GetCurrentServerID() = This will get the ID of the currently viewed server
 - BotNeckAPI.GetCurrentChannelID() = This will get the ID of the currently viewed channel
 - BotNeckAPI.GetDiscordToken() = This will get the discord token of the user(WARNING: Try to avoid the use of this as much as possible!)
 - BotNeckAPI.LoadConfig() = This loads the integrated configuration for BotNeck and applys the config to all loaded modules
 - BotNeckAPI.SaveConfig() = This saves the configurations of all the loaded modules and BotNeck itself
 - BotNeckAPI.GetParameterValueFromText(text, parameter key) = This gets the parameter value from a parameter key(example: parameter_key="Test" if that is your text then setting the parameter key as parameter_key will return Test)


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
> It is also recommended that you check the module's code for the following function: BotNeckAPI.GetDiscordToken as the function attempts to access your private discord account token!

 1. Go to your BetterDiscord plugins folder.
 2. Inside the folder open the BotNeck_Modules folder.
 3. Put the .module.js file/files inside the folder.
 4. And you are done!