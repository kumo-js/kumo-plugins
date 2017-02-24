
'use strict';

class PackageNameBuilder {

    constructor(params) {
        this._buildNumber = params.buildNumber;
    }

    build(lambdaName) {
        return `${lambdaName}-${this._buildNumber}.zip`;
    }

}

module.exports = PackageNameBuilder;
