'use strict';

class DerefTaskAttributes {

    constructor(params) {
        this._context = params.context;
        this._objectResolver = params.objectResolver;
    }

    execute(state) {
        return this._objectResolver.resolve(state.taskDef, state.taskVars).then(
            taskDef => Object.assign({}, state, {taskDef})
        );
    }
}

module.exports = DerefTaskAttributes;
