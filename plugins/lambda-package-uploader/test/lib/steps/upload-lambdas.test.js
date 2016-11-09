
const UploadLambdasStep = require('../../../lib/steps/upload-lambdas');

describe('LambdaPackageUploader UploadLambdasStep', () => {

    it('uploads lambdas', () => {
        const context = {
            settings: {
                uploadBucket: {
                    name: 'BUCKET_NAME',
                    region: 'BUCKET_REGION'
                }
            }
        };
        const s3Helper = {putObject: sinon.stub().returns(Promise.resolve())};
        const awsHelpers = {s3: sinon.stub().returns(s3Helper)};
        const step = new UploadLambdasStep({context, awsHelpers});

        const state = {
            packages: [
                {packageName: 'PACKAGE_1', packageData: 'PACKAGE_DATA_1'},
                {packageName: 'PACKAGE_2', packageData: 'PACKAGE_DATA_2'}
            ]
        };
        return step.execute(state).then(newState => {
            expect(newState).to.eql(state);
            expect(s3Helper.putObject.args).to.eql([
                [{Bucket: 'BUCKET_NAME', Key: 'PACKAGE_1', Body: 'PACKAGE_DATA_1'}],
                [{Bucket: 'BUCKET_NAME', Key: 'PACKAGE_2', Body: 'PACKAGE_DATA_2'}]
            ]);
        });
    });

});
