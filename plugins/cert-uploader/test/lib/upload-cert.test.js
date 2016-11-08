const UploadCertStep = require('../../lib/upload-cert');

describe('UploadCertStep', () => {

    it('uploads a certificate', () => {
        const iam = {
            uploadServerCertificate: sinon.stub().returns(Promise.resolve())
        };
        const settings = {
            CertificateBody: 'CERT_BODY',
            PrivateKey: 'PRIVATE_KEY',
            ServerCertificateName: 'CERT_NAME',
            CertificateChain: 'CERT_CHAIN',
            Path: 'CERT_PATH'
        };

        const params = {
            iam: iam,
            settings: settings
        };
        const step = new UploadCertStep(params);
        const promise = step.execute();

        return promise.then(() => {
            expect(iam.uploadServerCertificate.callCount).to.eql(1);
            expect(iam.uploadServerCertificate.args[0][0]).to.eql({
                CertificateBody: 'CERT_BODY',
                PrivateKey: 'PRIVATE_KEY',
                ServerCertificateName: 'CERT_NAME',
                CertificateChain: 'CERT_CHAIN',
                Path: 'CERT_PATH'
            });
        });
    });

});
