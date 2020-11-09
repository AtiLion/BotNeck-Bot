const fs = require('fs');
const path = require('path');
const GenericLoader = require('./GenericLoader');
const BotNeckLog = require('../../api/BotNeckLog');
const { v2Command } = require('../../api/v2Api');
const BotNeckCommand = require('../../api/BotNeckCommand');

module.exports = class v2Loader extends GenericLoader {
    /**
     * Creates a wrapper around the module that let's you easily load it
     * @param {String} file The module file to wrap
     * @param {any} module The require of the module to wrap
     */
    constructor(file, module) {
        super(file, module, 'v2Loader');

        this.commandModule = null;
    }

    /**
     * Loads the module and starts it
     */
    load() {
        if(!fs.existsSync(this.file)) return false;
        const code = fs.readFileSync(this.file).toString();
        const name = path.basename(this.file).slice(0, -('.botneck.js'.length));

        try {
            let generatedCode = 'const { BotNeckAPI } = require("../../api/v2Api");';
            generatedCode += '(function() {';
            generatedCode += 'let APIKey = "No longer required";';
            generatedCode += '\n' + code + '\n';
            generatedCode += `return new ${name}();`
            generatedCode += '})();';

            let oldModule = eval(generatedCode);
            this.commandModule = new v2Command(oldModule.command, oldModule.description, oldModule.usage, oldModule.execute);

            BotNeckCommand.registerCommand(this.commandModule);
            return true;
        } catch (err) {
            BotNeckLog.error(err, 'Failed to load module', name);
            return false;
        }
    }
    /**
     * Stops and unloads the module
     */
    unload() {}

    /**
     * Verifies the module's format if the v2 loader can load the module format
     * @param {String} file The file path to the module
     * @param {any} module The module.exports of the module
     * @returns {Boolean} If the v2 loader can load the module's format
     */
    static verifyFormat(file, module) {
        if(Object.keys(module).length > 0) return false;
        if(!file.endsWith('.botneck.js')) return false;

        // Get required variables
        const name = path.basename(file).slice(0, -('.botneck.js'.length));

        // Make an meh sandbox
        {
            try {
                if(!fs.existsSync(file)) return false;
                const code = fs.readFileSync(file).toString();

                let generatedCode = '(function(){';
                generatedCode += `let APIKey = 'No longer required';`;
                generatedCode += '\n' + code + '\n';
                generatedCode += `return (typeof ${name} === 'function');`;
                generatedCode += '})()';
                return eval(generatedCode);
            } catch (err) {
                BotNeckLog.error(err, 'Failed to verify V2 module!');
                return false;
            }
        }
    }
}