'use strict';

class PluginActionsBuilder {

    constructor(params) {
        this._actionDefs = params.actionDefs;
        this._contextFactory = params.contextFactory;
    }

    build() {
        return {
            actions: () => this._actionDefs.map(
                actionDef => ({
                    name: actionDef.name,
                    execute: this._buildExecuteFn(actionDef)
                })
            )
        }
    }

    _buildExecuteFn(actionDef) {
        return params =>
            this._contextFactory.createContext(params)
                .then(context => actionDef.createAction(context))
                .then(action => action.execute());
    }
}

module.exports = PluginActionsBuilder;
