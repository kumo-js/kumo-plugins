'use strict';

const Promise = require('bluebird');

class CollectOutputs {

    constructor(params) {
        this._fs = Promise.promisifyAll(params.fs);
    }

    execute(state) {
        const outputsFile = state.envVars.taskOutputsFile;

        return this._fs.existsAsync(outputsFile)
            .then(exists => exists ? this._readJson(outputsFile) : {})
            .then(outputs => Object.assign({}, state, {outputs}));
    }

    _readJson(file) {
        return this._fs.readFileAsync(file)
            .then(content => content.toString())
            .then(content => content === '' ? {} : JSON.parse(content));
    }
}

module.exports = CollectOutputs;
