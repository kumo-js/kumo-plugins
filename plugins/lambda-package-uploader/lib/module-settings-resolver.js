
'use strict';

class ModuleSettingsResolver {

    constructor(params) {
        this._jsonSchemaHelper = params.jsonSchemaHelper;
        this._wrapSettings = params.wrapSettings;
    }

    resolve(settings, args) {
        const state = {args, settings};
        return Promise.resolve(state)
            .then(state => this._resolveModuleSettings(state))
            .then(state => this._wrapSettings(state.args, state.moduleSettings));
    }

    _resolveModuleSettings(state) {
        const refData = {buildNumber: state.args['build-number']};
        return this._jsonSchemaHelper.derefWith(state.settings, refData)
            .then(moduleSettings => Object.assign({}, state, {moduleSettings}));
    }

}

module.exports = ModuleSettingsResolver;
