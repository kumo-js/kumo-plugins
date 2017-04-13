
'use strict';

class PackageNameBuilder {

    constructor(params) {
        this._buildNumber = params.buildNumber;
    }

    build(originalPackageName) {
        return `${originalPackageName}-${this._buildNumber}.zip`;
    }

}

module.exports = PackageNameBuilder;
