
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
        const resourceFilePath = state.args.resources;
        if (!resourceFilePath) return state;
        return this._fileReader.readAsObject(resourceFilePath)
            .then(resources => Object.assign({}, state, {resources}));
    }

    _resolveModuleSettings(state) {
        const refData = this._getRefData(state.args, state.resources);
        return this._jsonSchemaHelper.derefWith(state.settings, refData)
            .then(moduleSettings => Object.assign({}, state, {moduleSettings}));
    }

    _getRefData(args, resources) {
        const config = args.config && {config: JSON.parse(args.config)};
        const resourceObj = resources && {resources};
        return Object.assign(
            {
                buildNumber: args['build-number'],
                env: args.env
            },
            config,
            resourceObj
        );
    }

}

module.exports = ModuleSettingsResolver;
