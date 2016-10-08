
'use strict';

const Settings = require('./settings');

class ContextInitializer {

    constructor(params) {
        this._defaultContextInitializer = params.defaultContextInitializer;
        this._fileReader = params.fileReader;
        this._jsonSchemaHelper = params.jsonSchemaHelper;
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
        return this._fileReader.readJson(state.defaultContext.args.resources)
            .then(resources => Object.assign({}, state, {resources}));
    }

    _resolveModuleSettings(state) {
        const defaultContext = state.defaultContext;
        const args = defaultContext.args;
        const referenceDefinitions = {
            _build_number: args.build_number,
            _config: JSON.parse(args.config),
            _env: args.env,
            _resources: state.resources
        };
        return this._jsonSchemaHelper.derefWith(defaultContext.settings, referenceDefinitions)
            .then(moduleSettings => Object.assign({}, state, {moduleSettings}));
    }

    _wrapSettings(context, moduleSettings) {
        return new Settings({
            moduleSettings,
            args: context.args
        });
    }

}

module.exports = ContextInitializer;
