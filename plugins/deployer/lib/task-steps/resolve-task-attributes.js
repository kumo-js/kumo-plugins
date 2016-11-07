'use strict';

const _ = require('lodash');

class ResolveTaskAttributes {

    constructor(params) {
        this._context = params.context;
        this._jsonSchemaHelper = params.jsonSchemaHelper;
    }

    execute(state) {
        const taskDef = state.taskDef;
        const obj = Object.assign({taskDef}, this._getTaskVars(state));
        return this._jsonSchemaHelper.deref(obj).then(
            obj => Object.assign({}, state, {taskDef: obj.taskDef})
        );
    }

    _getTaskVars(state) {
        return _.reduce(state.taskVars, (result, v, k) => {
            return Object.assign(result, {[`_${k}`]: v});
        }, {});
    }
}

module.exports = ResolveTaskAttributes;
