
'use strict';

class UploadCertAction {

    constructor(params) {
        this._actionArgs = params.actionArgs;
        this._actionResultBuilder = params.actionResultBuilder;
        this._dataFormatter = params.dataFormatter;
        this._iamHelper = params.iamHelper;
        this._stdOut = params.stdOut;
    }

    execute() {
        const state = {};
        return Promise.resolve(state)
            .then(state => this._uploadCert(state))
            .then(state => this._outputResult(state));
    }

    _uploadCert(state) {
        const params = this._getUploadCertParams(this._actionArgs);
        return this._iamHelper.uploadServerCertificate(params)
            .then(uploadResult => Object.assign({}, state, {uploadResult}));
    }

    _outputResult(state) {
        const result = this._actionResultBuilder.build(state.uploadResult);
        return this._dataFormatter.format(result, 'json')
            .then(formattedOutput => this._stdOut.write(`${formattedOutput}\n`))
            .then(() => state);
    }

    _getUploadCertParams(actionArgs) {
        return {
            CertificateBody: actionArgs.body,
            PrivateKey: actionArgs['private-key'],
            ServerCertificateName: actionArgs.name,
            CertificateChain: actionArgs.chain,
            Path: actionArgs.path
        };
    }

}

module.exports = UploadCertAction;
