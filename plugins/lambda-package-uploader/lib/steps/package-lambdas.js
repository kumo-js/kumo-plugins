
'use strict';

class PackageLambdasStep {

    constructor(params) {
        this._context = params.context;
        this._lambdaPackager = params.lambdaPackager;
    }

    execute(state) {
        return this._packageLambdas(this._context.settings.packages)
            .then(packages => Object.assign({}, state, {packages}));
    }

    _packageLambdas(packagingConfigs) {
        return Promise.all(packagingConfigs.map(
            packagingConfig => this._lambdaPackager.package(packagingConfig)
        ));
    }

}

module.exports = PackageLambdasStep;
