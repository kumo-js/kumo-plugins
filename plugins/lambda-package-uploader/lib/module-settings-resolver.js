
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
            .then(state => this._loadResources(state))
            .then(state => this._resolveModuleSettings(state))
            .then(state => this._wrapSettings(state.args, state.moduleSettings));
    }

    _loadResources(state) {
        return this._fileReader.readAsObject(state.args.resources)
            .then(resources => Object.assign({}, state, {resources}));
    }

    _resolveModuleSettings(state) {
        const args = state.args;
        const refData = {
            buildNumber: args['build-number'],
            config: JSON.parse(args.config),
            env: args.env,
            resources: state.resources
        };
        return this._jsonSchemaHelper.derefWith(state.settings, refData)
            .then(moduleSettings => Object.assign({}, state, {moduleSettings}));
    }

}

module.exports = ModuleSettingsResolver;
