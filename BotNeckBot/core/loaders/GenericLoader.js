module.exports = class GenericLoader {
    /**
     * Creates a generic wrapper around the module that let's you easily load it
     * @param {String} file The module file to wrap
     * @param {any} module The require of the module to wrap
     * @param {String} type The type of the loader that is using the generic one
     */
    constructor(file, module, type) {
        this.file = file;
        this.module = module;
        this.type = type;
    }

    /**
     * Loads the module and starts it
     */
    load() {}
    /**
     * Stops and unloads the module
     */
    unload() {}
}