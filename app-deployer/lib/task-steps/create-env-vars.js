'use strict';

const Promise = require('bluebird');

class CreateEnvVars {

    constructor(params) {
        this._context = params.context;
        this._fs = Promise.promisifyAll(params.fs);
    }

    execute(state) {
        return this._dumpTaskParameters(state).then(files =>
            Object.assign({}, state, {
                envVars: {
                    appResourcesFile: files.appChainOutputsFile,
                    appConfig: JSON.stringify(state.appChainConfig),
                    env: this._context.env().value(),
                    region: state.taskDef.region,
                    taskOutputsFile: this._context.tempFile()
                }
            })
        );
    }

    _dumpTaskParameters(state) {
        const params = [state.appChainOutputs];
        const promises = params.map(c => this._dumpTempFile(c));
        return Promise.all(promises).then(files => ({appChainOutputsFile: files[0]}));
    }

    _dumpTempFile(content) {
        const file = this._context.tempFile();
        return this._fs.writeFileAsync(file, JSON.stringify(content)).then(() => file);
    }
}

module.exports = CreateEnvVars;
