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
                    appChainResourcesFile: files.appChainOutputsFile,
                    appResourcesFile: files.appOutputsFile,
                    appChainConfig: JSON.stringify(state.appChainConfig),
                    appConfig: JSON.stringify(this._getAppData(state.appChainConfig)),
                    env: this._context.env().value(),
                    region: state.taskDef.region,
                    taskOutputsFile: this._context.tempFile()
                }
            })
        );
    }

    _dumpTaskParameters(state) {
        const appChainOutputs = state.appChainOutputs;
        const appOutputs = this._getAppData(appChainOutputs);
        const items = [appChainOutputs, appOutputs];
        const promises = items.map(c => this._dumpTempFile(c));
        return Promise.all(promises).then(files =>
            ({appChainOutputsFile: files[0], appOutputsFile: files[1]})
        );
    }

    _dumpTempFile(content) {
        const file = this._context.tempFile();
        return this._fs.writeFileAsync(file, JSON.stringify(content)).then(() => file);
    }

    _getAppData(data) {
        const appName = this._context.settings().appName();
        return data[appName] || {};
    }
}

module.exports = CreateEnvVars;
