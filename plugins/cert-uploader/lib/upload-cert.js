'use strict';

class UploadCertStep {

    constructor(params) {
        this._iam = params.iam;
        this._settings = params.settings;
    }

    execute() {
        return this._iam.uploadServerCertificate(this._settings);
    }

}

module.exports = UploadCertStep;
