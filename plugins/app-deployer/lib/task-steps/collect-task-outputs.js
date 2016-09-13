'use strict';

class CollectTaskOutputs {

    constructor(params) {
        this._fileReader = params.fileReader;
    }

    execute(state) {
        const outputsFile = state.envVars.taskOutputsFile;
        return this._readJson(outputsFile).then(
            outputs => Object.assign({}, state, {outputs: outputs || {}})
        );
    }

    _readJson(file) {
        return this._fileReader.readJson(file, {ignoreNotFound: true});
    }
}

module.exports = CollectTaskOutputs;
