'use strict';

class StackNameExpander {

    constructor(params) {
        this._context = params.context;
    }

    expand(stackName) {
        const appName = this._context.settings().appName();
        const env = this._context.env().value();
        const name = `${env}-${appName}-${stackName}`;
        return name.replace(/\s/, '-').toLowerCase();
    }
}

module.exports = StackNameExpander;
