
const CertInfoBuilder = require('../../lib/cert-info-builder');

describe('CertUploader CertInfoBuilder', () => {

    it('builds up action result', () => {
        const certInfoBuilder = new CertInfoBuilder();
        const cert = {
            ServerCertificateMetadata: {
                ServerCertificateName: 'SERVER_CERTIFICATE_NAME',
                ServerCertificateId: 'SERVER_CERTIFICATE_ID',
                Arn: 'ARN'
            }
        };
        expect(certInfoBuilder.build('RESOURCE_NAME', cert)).to.eql({
            RESOURCE_NAME: {
                id: 'SERVER_CERTIFICATE_ID',
                arn: 'ARN',
                name: 'SERVER_CERTIFICATE_NAME'
            }
        });
    });
});
