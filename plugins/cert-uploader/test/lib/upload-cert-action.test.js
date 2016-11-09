const UploadCertAction = require('../../lib/upload-cert-action');

describe('CertUploader UploadCertAction', () => {

    it('uploads a certificate', () => {
        const actionResultBuilder = {build: sinon.stub().returns('ACTION_RESULT')};
        const dataFormatter = {format: sinon.stub().returns(Promise.resolve('FORMATTED_RESULT'))};
        const iamHelper = {
            uploadServerCertificate: sinon.stub().returns(Promise.resolve('UPLOAD_CERT_RESULT'))
        };
        const stdOut = {write: sinon.spy()};

        const actionArgs = {
            body: 'CERT_BODY',
            'private-key': 'PRIVATE_KEY',
            name: 'CERT_NAME',
            chain: 'CERT_CHAIN',
            path: 'CERT_PATH'
        };
        const step = new UploadCertAction({actionArgs, actionResultBuilder, dataFormatter, iamHelper, stdOut});

        return step.execute().then(() => {
            expect(iamHelper.uploadServerCertificate.args).to.eql([[{
                CertificateBody: 'CERT_BODY',
                PrivateKey: 'PRIVATE_KEY',
                ServerCertificateName: 'CERT_NAME',
                CertificateChain: 'CERT_CHAIN',
                Path: 'CERT_PATH'
            }]]);
            expect(actionResultBuilder.build.args).to.eql([['UPLOAD_CERT_RESULT']]);
            expect(dataFormatter.format.args).to.eql([['ACTION_RESULT', 'json']]);
            expect(stdOut.write.args).to.eql([['FORMATTED_RESULT\n']]);
        });
    });

});
