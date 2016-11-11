
'use strict';

class IamHelper {

    constructor(params) {
        this._iam = params.iam;
    }

    uploadServerCertificate(params) {
        return this._iam.uploadServerCertificate(params).promise();
    }

    getServerCertificate(name) {
        const params = {ServerCertificateName: name};
        return this._iam.getServerCertificate(params).promise()
            .catch(e => {
                if (e.code === 'NoSuchEntity') return null;
                throw e;
            });
    }

}

module.exports = IamHelper;
