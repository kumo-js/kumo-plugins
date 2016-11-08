const UploadCertStep = require('../../lib/upload-cert-action');

describe('UploadCertStep', () => {

    it('uploads a certificate', () => {
        const uploadCertResult = {
            ServerCertificateMetadata: {
                ServerCertificateName: 'SERVER_CERTIFICATE_NAME',
                Arn: 'ARN'
            }
        };
        const iamHelper = {
            uploadServerCertificate: sinon.stub().returns(Promise.resolve(uploadCertResult))
        };
        const stepArgs = {
            CertificateBody: 'CERT_BODY',
            PrivateKey: 'PRIVATE_KEY',
            ServerCertificateName: 'CERT_NAME',
            CertificateChain: 'CERT_CHAIN',
            Path: 'CERT_PATH'
        };
        const stdOut = {write: sinon.spy()};
        const dataFormatter = {format: sinon.stub().returns(Promise.resolve('FORMATTED_RESULT'))};
        const step = new UploadCertStep({dataFormatter, iamHelper, stepArgs, stdOut});

        return step.execute().then(() => {
            expect(iamHelper.uploadServerCertificate.args).to.eql([[{
                CertificateBody: 'CERT_BODY',
                PrivateKey: 'PRIVATE_KEY',
                ServerCertificateName: 'CERT_NAME',
                CertificateChain: 'CERT_CHAIN',
                Path: 'CERT_PATH'
            }]]);
            expect(dataFormatter.format.args).to.eql([[
                {SERVER_CERTIFICATE_NAME: 'ARN'},
                'json'
            ]]);
            expect(stdOut.write.args).to.eql([['FORMATTED_RESULT']]);
        });
    });

});
