const fs = require('fs');
const path = require('path');

const BotNeckLog = require('../api/BotNeckLog');
const { v2Loader, GenericLoader, v3Loader } = require('./loaders');

let _instance = null;
module.exports = class ModuleManager {
    /**
     * Creates the ModuleManager to load/use modules with
     */
    constructor() {
        this.modulesDirectory = path.resolve(__dirname, '../modules');
        /**
         * @type {[GenericLoader]}
         */
        this.modules = [];

        if(_instance) {
            BotNeckLog.error('ModuleManager instance already exists!');
            return;
        }
        if(!fs.existsSync(this.modulesDirectory)) {
            BotNeckLog.error('The modules directory does not exist!');
            return;
        }

        _instance = this;
    }
    /**
     * Destroys and cleans up the ModuleManager instance
     */
    destroy() {
        BotNeckLog.log('Unloading BotNeck modules ...');
        this.unloadModules();

        BotNeckLog.log('Cleaning up ModuleManager ...');
        _instance = null;
    }

    /**
     * Gets the main instance of the ModuleManager
     * @returns {ModuleManager} The instance of the module manager
     */
    static get Instance() { return _instance; }

    // TODO: Implement sandboxing when needed
    /**
     * Loads a module by it's name
     * @param {String} moduleName The module's name to load
     */
    loadModule(moduleName) {
        const modulePath = path.resolve(this.modulesDirectory, moduleName);
        if(!fs.existsSync(modulePath)) return;
        BotNeckLog.log('Initializing module', moduleName);

        const requiredModule = require(modulePath);
        if(v2Loader.verifyFormat(modulePath, requiredModule)) {
            BotNeckLog.log('Loading v2 module', moduleName);
            let modLoader = new v2Loader(modulePath, requiredModule);

            if(modLoader.load()) {
                this.modules.push(modLoader);
                BotNeckLog.log('Loaded v2 module', moduleName);
            }
        }
        else if(v3Loader.verifyFormat(modulePath, requiredModule)) {
            BotNeckLog.log('Loading v3 module', moduleName);
            let modLoader = new v3Loader(modulePath, requiredModule);

            if(modLoader.load()) {
                this.modules.push(modLoader);
                BotNeckLog.log('Loaded v3 module', moduleName);
            }
        }
    }
    /**
     * Loads all modules in the modules directory
     */
    loadModules() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.modulesDirectory, (err, files) => {
                if(err) return reject(err);

                for(let moduleFile of files) {
                    try { this.loadModule(moduleFile); }
                    catch (err) { BotNeckLog.error(err, 'Failed to auto-load module', moduleFile); }
                }
                resolve();
            });
        });
    }

    /**
     * Unloads the specified module with the module loader
     * @param {GenericLoader} moduleLoader The loader instance of the module you want to unload
     */
    unloadModule(moduleLoader) {
        if(!moduleLoader || !(moduleLoader instanceof GenericLoader)) return;

        moduleLoader.unload();
        let index = this.modules.indexOf(moduleLoader);
        this.modules.splice(index, 1);
        BotNeckLog.log('Unloaded module', path.basename(moduleLoader.file));
    }
    /**
     * Unloads all modules from the modules directory
     */
    unloadModules() {
        for(let modLoader of this.modules)
            this.unloadModule(modLoader);
    }
}