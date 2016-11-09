
const OutputPackageLocationsStep = require('../../../lib/steps/output-package-locations');

describe('LambdaPackageUploader OutputPackageLocationsStep', () => {

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
                {lambdaName: 'LAMBDA_NAME_1', packageName: 'PACKAGE_NAME_1'},
                {lambdaName: 'LAMBDA_NAME_2', packageName: 'PACKAGE_NAME_2'}
            ]
        };
        return step.execute(state).then(newState => {
            expect(newState).to.eql(state);
            expect(fs.writeFileAsync.args[0][0]).to.eql('OUTPUT_FILE');
            expect(JSON.parse(fs.writeFileAsync.args[0][1])).to.eql({
                LAMBDA_NAME_1: 's3://BUCKET_NAME/PACKAGE_NAME_1',
                LAMBDA_NAME_2: 's3://BUCKET_NAME/PACKAGE_NAME_2'
            });
        });
    });

});
