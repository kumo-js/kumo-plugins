
'use strict';

class PackageNameBuilder {

    constructor(params) {
        this._buildNumber = params.buildNumber;
        this._env = params.env;
    }

    build(lambdaName) {
        return `${this._env}-${lambdaName}-${this._buildNumber}.zip`;
    }

}

module.exports = PackageNameBuilder;
