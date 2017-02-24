'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class CollectDeploymentConfig {

    constructor(params) {
        this._context = params.context;
        this._deploymentScriptExecutor = params.deploymentScriptExecutor;
    }

    execute(state) {
        const configScriptDef = this._configScriptDef();
        const loadConfig = configScriptDef ? this._loadConfig() : Promise.resolve({});
        return loadConfig.then(config => Object.assign({}, state, {deploymentConfig: config}));
    }

    _loadConfig() {
        const configScriptDef = this._configScriptDef();
        const options = {cwd: this._context.cwd, logOutput: false};
        return this._deploymentScriptExecutor.execute(configScriptDef, options).then(JSON.parse);
    }

    _configScriptDef() {
        return _.get(this._context.settings, 'config');
    }
}

module.exports = CollectDeploymentConfig;
