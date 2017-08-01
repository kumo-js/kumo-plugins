'use strict';

const _ = require('lodash');

class CreateTaskVars {

    constructor(params) {
        this._context = params.context;
    }

    execute(state) {
        return Promise.resolve(
            _.merge({}, state, {taskVars: this._createTaskVars(state)})
        );
    }

    _createTaskVars(state) {
        return {
            deploymentConfig: state.deploymentConfig,
            deploymentOutputs: state.deploymentOutputs,
            dataSourceData: state.dataSourceData,

            taskOutputsFile: this._context.generateTempFile(),
            taskRegion: this._getTaskRegion(state.taskSection)
        }
    }
        
     _getTaskRegion(taskSection) {
         const deployRegion = this._context.args.region;
         const regionOverrides = taskSection.getValue().regionOverrides || [];
         return regionOverrides[deployRegion] || deployRegion;
     }
}

module.exports = CreateTaskVars;
