'use strict';

const _ = require('lodash');

class TaskDefExpander {

    constructor(params) {
        this._context = params.context;
    }

    expand(taskDef) {
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
}

module.exports = TaskDefExpander;
