
'use strict';

class Settings {

    constructor(params) {
        this._args = params.args;
        this._moduleSettings = params.moduleSettings;
    }

    get uploadBucket() {
        return Object.assign(
            {region: this._args.region},
            this._moduleSettings.uploadBucket
        );
    }

    get args() {
        return this._args;
    }

    get packages() {
        return this._moduleSettings.packages;
    }

}

module.exports = Settings;
