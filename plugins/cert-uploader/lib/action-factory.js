
'use strict';

const CertInfoBuilder = require('./cert-info-builder');
const AwsHelpers = require('../../../common-lib/lib/aws-helpers');
const DataFormatter = require('../../../common-lib/lib/data-formatter');
const UploadCertAction = require('./upload-cert-action');

class ActionFactory {

    createUploadCertAction(context) {
        return new UploadCertAction({
            certInfoBuilder: new CertInfoBuilder(),
            dataFormatter: new DataFormatter(),
            iamHelper: this._getIamHelper(context),
            stdOut: process.stdout,
            actionArgs: context.args
        });
    }

    _getIamHelper(context) {
        return new AwsHelpers().iam({region: context.args.region});
    }

}

module.exports = ActionFactory;
