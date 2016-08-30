'use strict';

class CollectConfig {

    constructor(params) {
        this._context = params.context;
        this._scriptExecutor = params.scriptExecutor;
    }

    execute(state) {
        return this._generateConfig()
            .then(config => Object.assign({}, state, {config}));
    }

    _generateConfig() {
        const script = this._context.settings().config().script;
        const envVars = {env: this._context.env().value()};
        const scriptOptions = {env: envVars, logOutput: false};
        return this._scriptExecutor.execute(script, scriptOptions);
    }
}

module.exports = CollectConfig;
