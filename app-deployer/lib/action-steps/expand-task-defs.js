'use strict';

const _ = require('lodash');

class ExpandTaskDefs {

    constructor(params) {
        this._context = params.context;
    }

    execute(state) {
        return Promise.resolve()
            .then(() => this._taskDefs().map(taskDef => this._assignRegion(taskDef)))
            .then(taskDefs => _.assign({}, state, {taskDefs: taskDefs}));
    }

    _assignRegion(taskDef) {
        const regionOverrides = taskDef.regionOverrides || [];
        const region = regionOverrides[this._region()] || this._region();
        return _.assign(_.omit(taskDef, 'regionOverrides'), {region});
    }

    _region() {
        return this._context.region();
    }

    _taskDefs() {
        return this._context.settings().tasks();
    }
}

module.exports = ExpandTaskDefs;
