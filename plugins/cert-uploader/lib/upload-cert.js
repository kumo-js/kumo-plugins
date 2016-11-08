
'use strict';

class UploadCertStep {

    constructor(params) {
        this._iamHelper = params.iamHelper;
        this._stepArgs = params.stepArgs;
    }

    execute() {
        const params = this._stepArgs;
        return this._iamHelper.uploadServerCertificate(params);
    }

}

module.exports = UploadCertStep;
