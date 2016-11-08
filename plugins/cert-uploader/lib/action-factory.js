
'use strict';

const AwsHelpers = require('../../../common-lib/aws-helpers');
const DataFormatter = require('../../../common-lib/data-formatter');
const UploadCertAction = require('./upload-cert-action');

class ActionFactory {

    createUploadCertAction(context) {
        return new UploadCertAction({
            dataFormatter: new DataFormatter(),
            iamHelper: this._getIamHelper(context),
            stdOut: process.stdout,
            stepArgs: this._getUploadCertStepArgs(context)
        });
    }

    _getIamHelper(context) {
        return new AwsHelpers().iam({region: context.args});
    }

    _getUploadCertStepArgs(context) {
        const args = context.args;
        return {
            CertificateBody: args.body,
            PrivateKey: args['private-key'],
            ServerCertificateName: args.name,
            CertificateChain: args.chain,
            Path: args.path
        };
    }

}

module.exports = ActionFactory;
