const UploadCertAction = require('../../lib/upload-cert-action');

describe('CertUploader UploadCertAction', () => {

    it('fetches the existing certificate information if it is available', () => {
        const certInfoBuilder = {build: sinon.stub().returns('CERT_INFO')};
        const dataFormatter = {format: sinon.stub().returns(Promise.resolve('CERT_INFO_STRING'))};
        const iamHelper = {
            getServerCertificate: sinon.stub().returns(Promise.resolve({ServerCertificate: 'CERT'}))
        };
        const stdOut = {write: sinon.spy()};

        const actionArgs = {name: 'CERT_NAME'};
        const action = new UploadCertAction({actionArgs, certInfoBuilder, dataFormatter, iamHelper, stdOut});

        return action.execute().then(() => {
            expect(iamHelper.getServerCertificate.args).to.eql([['CERT_NAME']]);
            expect(certInfoBuilder.build.args).to.eql([['CERT']]);
            expect(dataFormatter.format.args).to.eql([['CERT_INFO', 'json']]);
            expect(stdOut.write.args).to.eql([['CERT_INFO_STRING\n']]);
        });
    });

    it('uploads a certificate', () => {
        const certInfoBuilder = {build: sinon.stub().returns('CERT_INFO')};
        const dataFormatter = {format: sinon.stub().returns(Promise.resolve('CERT_INFO_STRING'))};
        const iamHelper = {
            getServerCertificate: () => Promise.resolve(null),
            uploadServerCertificate: sinon.stub().returns(Promise.resolve('UPLOAD_CERT_INFO'))
        };
        const stdOut = {write: sinon.spy()};

        const actionArgs = {
            body: 'CERT_BODY',
            'private-key': 'PRIVATE_KEY',
            name: 'CERT_NAME',
            chain: 'CERT_CHAIN',
            path: 'CERT_PATH'
        };
        const action = new UploadCertAction({actionArgs, certInfoBuilder, dataFormatter, iamHelper, stdOut});

        return action.execute().then(() => {
            expect(iamHelper.uploadServerCertificate.args).to.eql([[{
                CertificateBody: 'CERT_BODY',
                PrivateKey: 'PRIVATE_KEY',
                ServerCertificateName: 'CERT_NAME',
                CertificateChain: 'CERT_CHAIN',
                Path: 'CERT_PATH'
            }]]);
            expect(certInfoBuilder.build.args).to.eql([['UPLOAD_CERT_INFO']]);
            expect(dataFormatter.format.args).to.eql([['CERT_INFO', 'json']]);
            expect(stdOut.write.args).to.eql([['CERT_INFO_STRING\n']]);
        });
    });

});
