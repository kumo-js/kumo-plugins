'use strict';

const _ = require('lodash');

class ExpandTaskDefs {

    constructor(params) {
        this._context = params.context;
    }

    execute(state) {
        return Promise.resolve()
            .then(() => this._taskDefs().map(taskDef => this._expandTaskDef(taskDef)))
            .then(taskDefs => Object.assign({}, state, {taskDefs: taskDefs}));
    }

    _expandTaskDef(taskDef) {
        taskDef = this._assignTaskType(taskDef);
        taskDef = this._assignRegion(taskDef);
        return taskDef;
    }

    _assignTaskType(taskDef) {
        return Object.assign({}, taskDef, {type: taskDef.type || 'custom'});
    }

    _assignRegion(taskDef) {
        const regionOverrides = taskDef.regionOverrides || [];
        const region = regionOverrides[this._region()] || this._region();
        return Object.assign(_.omit(taskDef, 'regionOverrides'), {region});
    }

    _region() {
        return this._context.args.region;
    }

    _taskDefs() {
        return this._context.settings.tasks();
    }
}

module.exports = ExpandTaskDefs;
