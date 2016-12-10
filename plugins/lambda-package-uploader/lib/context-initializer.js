'use strict';

class ContextInitializer {

    constructor(params) {
        this._defaultContextInitializer = params.defaultContextInitializer;
        this._fileReader = params.fileReader;
        this._jsonSchemaHelper = params.jsonSchemaHelper;
        this._wrapSettings = params.wrapSettings;
    }

    initialize(context, actionParams) {
        const state = {context, actionParams};
        return Promise.resolve(state)
            .then(state => this._loadDefaultContext(state))
            .then(state => this._loadResources(state))
            .then(state => this._resolveModuleSettings(state))
            .then(state => {
                const defaultContext = state.defaultContext;
                return Object.assign({}, defaultContext, {
                    settings: this._wrapSettings(defaultContext, state.moduleSettings)
                });
            });
    }

    _loadDefaultContext(state) {
        return this._defaultContextInitializer.initialize(state.context, state.actionParams)
            .then(defaultContext => Object.assign({}, state, {defaultContext}));
    }

    _loadResources(state) {
        return this._fileReader.readAsObject(state.defaultContext.args.resources)
            .then(resources => Object.assign({}, state, {resources}));
    }

    _resolveModuleSettings(state) {
        const defaultContext = state.defaultContext;
        const args = defaultContext.args;

        const refData = {
            buildNumber: args['build-number'],
            config: JSON.parse(args.config),
            env: args.env,
            resources: state.resources
        };
        return this._jsonSchemaHelper.derefWith(defaultContext.settings, refData)
            .then(moduleSettings => Object.assign({}, state, {moduleSettings}));
    }

}

module.exports = ContextInitializer;
