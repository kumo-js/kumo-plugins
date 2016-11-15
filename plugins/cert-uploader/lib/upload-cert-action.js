
'use strict';

class UploadCertAction {

    constructor(params) {
        this._actionArgs = params.actionArgs;
        this._certInfoBuilder = params.certInfoBuilder;
        this._dataFormatter = params.dataFormatter;
        this._iamHelper = params.iamHelper;
        this._stdOut = params.stdOut;
    }

    execute() {
        const state = {};
        return Promise.resolve(state)
            .then(state => this._fetchCert(state))
            .then(state => this._uploadCertIfNotFetched(state))
            .then(state => this._outputCertMeta(state));
    }

    _fetchCert(state) {
        return this._iamHelper.getServerCertificate(this._actionArgs.name)
            .then(result => Object.assign({}, state, {
                cert: result && result.ServerCertificate
            }));
    }

    _uploadCertIfNotFetched(state) {
        if (state.cert) return Promise.resolve(state);

        const params = this._getUploadCertParams(this._actionArgs);
        return this._iamHelper.uploadServerCertificate(params)
            .then(cert => Object.assign({}, state, {cert}));
    }

    _outputCertMeta(state) {
        const resourceName = this._actionArgs['resource-name'];
        const result = this._certInfoBuilder.build(resourceName, state.cert);
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
