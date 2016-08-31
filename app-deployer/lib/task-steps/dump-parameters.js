'use strict';

const Promise = require('bluebird');

class DumpParameters {

    constructor(params) {
        this._context = params.context;
        this._fs = Promise.promisifyAll(params.fs);
    }

    execute(state) {
        return this._dumpParameters(state)
            .then(files => Object.assign({}, state, files));
    }

    _dumpParameters(state) {
        const contents = [state.appOutputs, state.appChainOutputs];
        return Promise.all(contents.map(c => this._dumpTempFile(c)))
            .then(files => ({appOutputsFile: files[0], appChainOutputsFile: files[1]}));
    }

    _dumpTempFile(content) {
        const file = this._context.tempFile();
        return this._fs.writeFileAsync(file, JSON.stringify(content)).then(() => file);
    }
}

module.exports = DumpParameters;
