const fs = require('fs');
const path = require('path');

const BotNeckLog = require('../api/BotNeckLog');
const { v2Loader } = require('./loaders');

const _instance = null;
module.exports = class ModuleManager {
    constructor() {
        this.modulesDirectory = path.resolve(__dirname, '../modules');
        this.modules = [];

        if(_instance) {
            BotNeckLog.error('ModuleManager instance already exists!');
            return;
        }
        if(!fs.existsSync(this.modulesDirectory)) {
            BotNeckLog.error('The modules directory does not exist!');
            return;
        }
    }
    destroy() {
        BotNeckLog.log('Unloading BotNeck modules ...');
        this.unloadModules();

        BotNeckLog.log('Cleaning up ModuleManager ...');
        _instance = null;
    }

    static get Instance() { return _instance; }

    // TODO: Implement sandboxing when needed
    loadModule(moduleName) {
        const modulePath = path.resolve(this.modulesDirectory, moduleName);
        if(!fs.existsSync(modulePath)) return;

        const requiredModule = require(modulePath);
        if(v2Loader.verifyFormat(modulePath, requiredModule)) {
            
        }

        BotNeckLog.log(`Loaded BotNeck module ${moduleName}`);
    }
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

    unloadModule() {
    }
    unloadModules() {
    }
}