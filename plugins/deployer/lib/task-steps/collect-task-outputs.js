'use strict';

class CollectTaskOutputs {

    constructor(params) {
        this._fileReader = params.fileReader;
    }

    execute(state) {
        const outputsName = state.taskDef.outputsName;
        const outputsFile = state.taskVars.taskOutputsFile;

        return this._readAsObject(outputsFile)
            .then(outputs => outputsName ? {[outputsName]: outputs} : outputs)
            .then(outputs => Object.assign({}, state, {outputs: outputs || {}}));
    }

    _readAsObject(file) {
        return this._fileReader.readAsObject(file, {ignoreNotFound: true});
    }
}

module.exports = CollectTaskOutputs;
