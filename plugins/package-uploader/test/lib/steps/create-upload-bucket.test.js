
const CreateUploadBucketStep = require('../../../lib/steps/create-upload-bucket');

describe('PackageUploader CreateUploadBucketStep', () => {

    it('does nothing if an upload bucket already exists', () => {
        const s3Helper = {
            bucketExists: sinon.stub().returns(Promise.resolve(true)),
            createBucket: sinon.spy()
        };
        const awsHelpers = {s3: sinon.stub().returns(s3Helper)};
        const step = new CreateUploadBucketStep({
            awsHelpers,
            context: fakeContext()
        });

        const state = {};
        return step.execute(state).then(newState => {
            expect(newState).to.eql({});
            expect(awsHelpers.s3.args[0][0]).to.eql({region: 'BUCKET_REGION'});
            expect(s3Helper.bucketExists.args[0][0]).to.eql('BUCKET_NAME');
            expect(s3Helper.createBucket.callCount).to.eql(0);
        });
    });

    it('creates a bucket if one does not exist', () => {
        const s3Helper = {
            bucketExists: sinon.stub().returns(Promise.resolve(false)),
            createBucket: sinon.spy()
        };
        const step = new CreateUploadBucketStep({
            awsHelpers: {s3: sinon.stub().returns(s3Helper)},
            context: fakeContext()
        });

        const state = {};
        return step.execute(state).then(newState => {
            expect(newState).to.eql({});
            expect(s3Helper.createBucket.args[0][0]).to.eql({Bucket: 'BUCKET_NAME'});
        });
    });

    function fakeContext() {
        return {
            settings: {
                uploadBucket: {
                    name: 'BUCKET_NAME',
                    region: 'BUCKET_REGION'
                }
            }
        };
    }

});
