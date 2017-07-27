'use strict';

class CollectDeploymentConfig {

    constructor(params) {
        this._context = params.context;
        this._deploymentScriptExecutor = params.deploymentScriptExecutor;
    }

    execute(state) {
        return this._extractConfigScriptDef()
            .then(scriptDef => this._loadConfig(scriptDef))
            .then(deploymentConfig => {
                this._context.settings.addRefData({deploymentConfig});
                return Object.assign({}, state, {deploymentConfig});
            });
    }

    _loadConfig(scriptDef) {
        if (!scriptDef) return Promise.resolve({});
        const options = {cwd: this._context.cwd, logOutput: false};
        return this._deploymentScriptExecutor.execute(scriptDef, options).then(JSON.parse);
    }

    _extractConfigScriptDef() {
        return this._context.settings.extract('config');
    }
}

module.exports = CollectDeploymentConfig;
