const GenericLoader = require('./GenericLoader');
const BotNeckLog = require('../../api/BotNeckLog');

module.exports = class v2Loader extends GenericLoader {
    /**
     * Creates a wrapper around the module that let's you easily load it
     * @param {String} file The module file to wrap
     * @param {any} module The require of the module to wrap
     */
    constructor(file, module) {
        super(file, module, 'v2Loader');
    }

    /**
     * Loads the module and starts it
     */
    load() {}
    /**
     * Stops and unloads the module
     */
    unload() {}

    /**
     * Verifies the module's format if the v2 loader can load the module format
     * @param {String} file The file path to the module
     * @param {any} module The module.exports of the module
     * @returns {boolean} If the v2 loader can load the module's format
     */
    static verifyFormat(file, module) {
        if(module) return false;
        if(!file.endsWith('.botneck.js')) return false;

        // Get required variables
        const name = file.slice(0, -('.botneck.js'.length));

        // Make an meh sandbox
        {
            try {
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