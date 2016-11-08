'use strict';

class StackNameExpander {

    constructor(params) {
        this._context = params.context;
    }

    expand(stackName) {
        const moduleName = this._context.settings.moduleName;
        const env = this._context.env.value();
        const name = `${env}-${moduleName}-${stackName}`;
        return name.replace(/\s/, '-').toLowerCase();
    }
}

module.exports = StackNameExpander;
