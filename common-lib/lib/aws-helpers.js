'use strict';

const aws = require('aws-sdk');
const CfHelper = require('./cf-helper');
const IamHelper = require('./iam-helper');
const KmsHelper = require('./kms-helper');
const S3Helper = require('./s3-helper');

class AwsHelpers {

    cf(options) {
        return new CfHelper({
            cf: new aws.CloudFormation(options)
        });
    }

    s3(options) {
        return new S3Helper({
            s3: new aws.S3(options)
        });
    }

    kms(options) {
        return new KmsHelper({
            kms: new aws.KMS(options)
        });
    }

    iam(options) {
        return new IamHelper({
            iam: new aws.IAM(options)
        });
    }

}

module.exports = AwsHelpers;
