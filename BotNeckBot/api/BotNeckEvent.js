const BotNeckLog = require('./BotNeckLog')

module.exports = class BotNeckEvent {
    constructor() {
        this.callbacks = [];
    }

    /**
     * Calls the specified function when the event is triggered
     * @param {Function} func The callback function to call when event is triggered
     */
    addEventCallback(func) {
        if(this.callbacks.includes(func)) return;

        this.callbacks.push(func);
    }
    /**
     * Removes the specified function from the callback stack
     * @param {Function} func The callback function to remove from the stack
     */
    removeEventCallback(func) {
        if(!this.callbacks.includes(func)) return;

        let index = this.callbacks.indexOf(func);
        this.callbacks.splice(index, 1);
    }

    /**
     * Calls the specified function when the event is triggered and removes the function from callback
     * @param {Function} func The callback function to call when event is triggered
     */
    callbackOnce(func) {
        let handle = (...args) => {
            let index = this.callbacks.indexOf(handle);
            this.callbacks.splice(index, 1);

            func(...args);
        };
        this.callbacks.push(handle);
    }

    /**
     * Calls all the callbacks on stack of the event
     * @param  {...any} params The parameters to pass to the callbacks when the event is invoked
     */
    invoke(...params) {
        for(let cb of [...this.callbacks]) {
            try { cb(...params); }
            catch (err) { BotNeckLog.error(err, 'Failed to invoke callback', cb); }
        }
    }
}