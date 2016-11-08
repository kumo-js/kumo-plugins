
'use strict';

const AwsHelpers = require('../../../common-lib/aws-helpers');
const UploadCertStep = require('./upload-cert');

class ActionFactory {

    createUploadCertAction(context) {
        return new UploadCertStep({
            stepArgs: this._getUploadCertStepArgs(context),
            iamHelper: this._getIamHelper(context)
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
