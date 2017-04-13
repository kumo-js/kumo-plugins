
'use strict';

class PackageStep {

    constructor(params) {
        this._context = params.context;
        this._packager = params.packager;
    }

    execute(state) {
        return this._package(this._context.settings.packages)
            .then(packages => Object.assign({}, state, {packages}));
    }

    _package(packagingConfigs) {
        return Promise.all(packagingConfigs.map(
            packagingConfig => this._packager.package(packagingConfig)
        ));
    }

}

module.exports = PackageStep;
