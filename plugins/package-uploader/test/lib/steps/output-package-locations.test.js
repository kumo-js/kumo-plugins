
const OutputPackageLocationsStep = require('../../../lib/steps/output-package-locations');

describe('PackageUploader OutputPackageLocationsStep', () => {

    it('writes package locations into a JOSN file', () => {
        const context = {
            settings: {
                uploadBucket: {name: 'BUCKET_NAME'},
                args: {output: 'OUTPUT_FILE'}
            }
        };
        const fs = {writeFileAsync: sinon.stub().returns(Promise.resolve())};
        const step = new OutputPackageLocationsStep({context, fs});

        const state = {
            packages: [
                {originalPackageName: 'ORG_PACKAGE_NAME_1', finalPackageName: 'FINAL_PACKAGE_NAME_1'},
                {originalPackageName: 'ORG_PACKAGE_NAME_2', finalPackageName: 'FINAL_PACKAGE_NAME_2'}
            ]
        };
        return step.execute(state).then(newState => {
            expect(newState).to.eql(state);
            expect(fs.writeFileAsync.args[0][0]).to.eql('OUTPUT_FILE');
            expect(JSON.parse(fs.writeFileAsync.args[0][1])).to.eql({
                ORG_PACKAGE_NAME_1: {s3Bucket: 'BUCKET_NAME', s3Key: 'FINAL_PACKAGE_NAME_1'},
                ORG_PACKAGE_NAME_2: {s3Bucket: 'BUCKET_NAME', s3Key: 'FINAL_PACKAGE_NAME_2'}
            });
        });
    });

});
