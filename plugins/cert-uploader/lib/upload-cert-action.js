
'use strict';

class UploadCertAction {

    constructor(params) {
        this._dataFormatter = params.dataFormatter;
        this._iamHelper = params.iamHelper;
        this._stepArgs = params.stepArgs;
        this._stdOut = params.stdOut;
    }

    execute() {
        const state = {};
        return Promise.resolve(state)
            .then(state => this._uploadCert(state))
            .then(state => this._outputResult(state));
    }

    _uploadCert(state) {
        return this._iamHelper.uploadServerCertificate(this._stepArgs)
            .then(data => Object.assign({}, state, {cert: data.ServerCertificateMetadata}));
    }

    _outputResult(state) {
        const certArn = {[state.cert.ServerCertificateName]: state.cert.Arn};
        return this._dataFormatter.format(certArn, 'json')
            .then(formattedOutput => this._stdOut.write(formattedOutput));
    }

}

module.exports = UploadCertAction;
