'use strict';

const _ = require('lodash');

const SEPARATOR = '-';

class StackNameExpander {

    constructor(params) {
        this._context = params.context;
    }

    expand(stackName) {
        const moduleName = this._context.settings.moduleName;
        const env = this._context.env.value();
        const fullName = _.compact([env, moduleName, stackName]).join(SEPARATOR);
        return fullName.replace(/\s/, SEPARATOR).toLowerCase();
    }
}

module.exports = StackNameExpander;
