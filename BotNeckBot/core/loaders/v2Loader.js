const GenericLoader = require('./GenericLoader');
const BotNeckLog = require('../../api/BotNeckLog');

module.exports = class v2Loader extends GenericLoader {
    constructor(file, module) {
        super(file, module, 'v2Loader');
    }

    load() {}
    unload() {}

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