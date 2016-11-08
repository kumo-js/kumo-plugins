const UploadCertStep = require('../../lib/upload-cert');

describe('UploadCertStep', () => {

    it('uploads a certificate', () => {
        const iamHelper = {
            uploadServerCertificate: sinon.stub().returns(Promise.resolve())
        };
        const stepArgs = {
            CertificateBody: 'CERT_BODY',
            PrivateKey: 'PRIVATE_KEY',
            ServerCertificateName: 'CERT_NAME',
            CertificateChain: 'CERT_CHAIN',
            Path: 'CERT_PATH'
        };

        const step = new UploadCertStep({iamHelper, stepArgs});
        const promise = step.execute();

        return promise.then(() => {
            expect(iamHelper.uploadServerCertificate.callCount).to.eql(1);
            expect(iamHelper.uploadServerCertificate.args[0][0]).to.eql({
                CertificateBody: 'CERT_BODY',
                PrivateKey: 'PRIVATE_KEY',
                ServerCertificateName: 'CERT_NAME',
                CertificateChain: 'CERT_CHAIN',
                Path: 'CERT_PATH'
            });
        });
    });

});
