'use strict';

class PluginHelper {

    constructor(params) {
        this._contextInitializer = params.contextInitializer;
        this._actionDefs = params.actionDefs;
    }

    actions() {
        return this._actionDefs.map(actionDef => ({
            name: actionDef.name,
            execute: this._createExecuteFn(actionDef)
        }));
    }

    _createExecuteFn(actionDef) {
        return actionParams =>
            this._contextInitializer.initialize({}, actionParams)
                .then(context => actionDef.createAction(context))
                .then(action => action.execute());
    }
}

module.exports = PluginHelper;
