'use strict';

class DerefTaskAttributes {

    constructor(params) {
        this._context = params.context;
        this._jsonSchemaHelper = params.jsonSchemaHelper;
    }

    execute(state) {
        return this._jsonSchemaHelper.derefWith(state.taskDef, state.taskVars).then(
            taskDef => Object.assign({}, state, {taskDef})
        );
    }
}

module.exports = DerefTaskAttributes;
