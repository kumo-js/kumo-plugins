
'use strict';

class ModuleSettingsResolver {

    constructor(params) {
        this._jsonSchemaHelper = params.jsonSchemaHelper;
        this._fileReader = params.fileReader;
        this._wrapSettings = params.wrapSettings;
    }

    resolve(settings, args) {
        const state = {args, settings};
        return Promise.resolve(state)
            .then(state => this._loadConfig(state))
            .then(state => this._loadResources(state))
            .then(state => this._resolveModuleSettings(state))
            .then(state => this._wrapSettings(state.args, state.moduleSettings));
    }

    _loadConfig(state) {
        const configFilePath = state.args.config;
        if (!configFilePath) return state;
        return this._fileReader.readAsObject(configFilePath)
            .then(config => Object.assign({}, state, {config}));
    }

    _loadResources(state) {
        const resourceFilePath = state.args.resources;
        if (!resourceFilePath) return state;
        return this._fileReader.readAsObject(resourceFilePath)
            .then(resources => Object.assign({}, state, {resources}));
    }

    _resolveModuleSettings(state) {
        const refData = this._getRefData(state.args, state.config, state.resources);
        return this._jsonSchemaHelper.derefWith(state.settings, refData)
            .then(moduleSettings => Object.assign({}, state, {moduleSettings}));
    }

    _getRefData(args, config, resources) {
        return Object.assign(
            {
                buildNumber: args['build-number'],
                env: args.env
            },
            config && {config},
            resources && {resources}
        );
    }

}

module.exports = ModuleSettingsResolver;