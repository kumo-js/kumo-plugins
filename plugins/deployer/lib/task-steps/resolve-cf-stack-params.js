'use strict';

class ResolveCfStackParams {

    constructor(params) {
        this._context = params.context;
        this._jsonSchemaHelper = params.jsonSchemaHelper;
    }

    execute(state) {
        const taskDef = state.taskDef;
        const stackParams = taskDef.stackParams;
        const obj = Object.assign({stackParams}, this._stackParamsData(state));

        return this._jsonSchemaHelper.deref(obj)
            .then(obj => Object.assign({}, taskDef, {stackParams: obj.stackParams}))
            .then(taskDef => Object.assign({}, state, {taskDef}));
    }

    _stackParamsData(state) {
        return {
            env: this._context.env.value(),
            region: state.taskDef.region,
            config: state.deploymentConfig,
            outputs: state.deploymentOutputs
        };
    }
}

module.exports = ResolveCfStackParams;
