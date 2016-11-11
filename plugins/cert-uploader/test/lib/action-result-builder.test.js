
const ActionResultBuilder = require('../../lib/action-result-builder');

describe('CertUploader ActionResultBuilder', () => {

    it('builds up action result', () => {
        const actionResultBuilder = new ActionResultBuilder();
        const uploadCertResult = {
            ServerCertificateMetadata: {
                ServerCertificateName: 'SERVER_CERTIFICATE_NAME',
                ServerCertificateId: 'SERVER_CERTIFICATE_ID',
                Arn: 'ARN'
            }
        };
        expect(actionResultBuilder.build(uploadCertResult)).to.eql({
            SERVER_CERTIFICATE_NAME: {
                id: 'SERVER_CERTIFICATE_ID',
                arn: 'ARN'
            }
        });
    });
});
