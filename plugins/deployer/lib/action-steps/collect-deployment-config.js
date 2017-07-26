'use strict';

const _ = require('lodash');

class CollectDeploymentConfig {

    constructor(params) {
        this._context = params.context;
        this._deploymentScriptExecutor = params.deploymentScriptExecutor;
        this._objectResolver = params.objectResolver;
    }

    execute(state) {
        const configScriptDef = this._configScriptDef();
        const loadConfig = configScriptDef ? this._loadConfig() : Promise.resolve({});
        return loadConfig.then(config => Object.assign({}, state, {deploymentConfig: config}));
    }

    _loadConfig() {
        const configDef = this._configScriptDef();
        const options = {cwd: this._context.cwd, logOutput: false};
        return this._objectResolver.resolve(configDef, {})
            .then(configDef => this._deploymentScriptExecutor.execute(configDef, options))
            .then(JSON.parse);
    }

    _configScriptDef() {
        return _.get(this._context.settings, 'config');
    }
}

module.exports = CollectDeploymentConfig;
