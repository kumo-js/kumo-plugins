
const IamHelper = require('../lib/iam-helper');

describe('IamHelper', () => {

    describe('#uploadServerCertificate', () => {

        it('uploads certificate', () => {
            const iam = {
                uploadServerCertificate: sinon.stub().returns({
                    promise: () => Promise.resolve('RESULT')
                })
            };
            const iamHelper = new IamHelper({iam});
            return iamHelper.uploadServerCertificate('PARAMS').then(result => {
                expect(result).to.eql('RESULT');
                expect(iam.uploadServerCertificate.args).to.eql([['PARAMS']]);
            });
        });
    });

    describe('#getServerCertificate', () => {

        it('fetches certificate by name', () => {
            const iam = {
                getServerCertificate: sinon.stub().returns({
                    promise: () => Promise.resolve('RESULT')
                })
            };
            const iamHelper = new IamHelper({iam});
            return iamHelper.getServerCertificate('CERT_NAME').then(result => {
                expect(result).to.eql('RESULT');
                expect(iam.getServerCertificate.args).to.eql(
                    [[{ServerCertificateName: 'CERT_NAME'}]]
                );
            });
        });

        it('returns null if there is no certificate matches to the given name', () => {
            const noSuchEntityError = Object.assign(new Error('ERROR'), {code: 'NoSuchEntity'});
            const iam = {
                getServerCertificate: sinon.stub().returns({
                    promise: () => Promise.reject(noSuchEntityError)
                })
            };
            const iamHelper = new IamHelper({iam});
            return iamHelper.getServerCertificate('CERT_NAME').then(result => {
                expect(result).to.eql(null);
            });
        });

        it('throws an error if non- certificate not found error occurred', () => {
            const iam = {
                getServerCertificate: sinon.stub().returns({
                    promise: () => Promise.reject(new Error('UNEXPECTED_ERROR'))
                })
            };
            const iamHelper = new IamHelper({iam});
            return iamHelper.getServerCertificate('CERT_NAME').then(
                throwError,
                e => {
                    expect(e).to.be.an('error');
                    expect(e.message).to.eql('UNEXPECTED_ERROR');
                }
            );
        });
    });
});
