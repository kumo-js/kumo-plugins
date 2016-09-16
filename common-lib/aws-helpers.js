'use strict';

const aws = require('aws-sdk');
const CfHelper = require('./cf-helper');
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
}

module.exports = AwsHelpers;
