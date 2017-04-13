
'use strict';

class Settings {

    constructor(params) {
        this._args = params.args;
        this._moduleSettings = params.moduleSettings;
    }

    get uploadBucket() {
        return {
            region: this._args.region,
            name: this._args['upload-bucket']
        };
    }

    get args() {
        return this._args;
    }

    get packages() {
        return this._moduleSettings.packages;
    }

}

module.exports = Settings;
