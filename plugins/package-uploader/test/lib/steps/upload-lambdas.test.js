
const UploadPackagesStep = require('../../../lib/steps/upload-packages');

describe('PackageUploader UploadPackagesStep', () => {

    it('uploads packages', () => {
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
        const step = new UploadPackagesStep({context, awsHelpers});

        const state = {
            packages: [
                {finalPackageName: 'PACKAGE_1', packageData: 'PACKAGE_DATA_1'},
                {finalPackageName: 'PACKAGE_2', packageData: 'PACKAGE_DATA_2'}
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
