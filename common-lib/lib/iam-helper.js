
'use strict';

class IamHelper {

    constructor(params) {
        this._iam = params.iam;
    }

    uploadServerCertificate(params) {
        return this._iam.uploadServerCertificate(params).promise();
    }

}

module.exports = IamHelper;
