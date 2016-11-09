
const LambdaPackager = require('../../lib/lambda-packager');

describe('LambdaPackageUploader LambdaPackager', () => {

    it('packages a lambda', () => {
        const packageNameBuilder = {build: sinon.stub().returns('PACKAGE_NAME')};
        const scriptExecutor = {execute: sinon.stub().returns(Promise.resolve())};
        const zipHelper = {addDataToZip: sinon.stub().returns(Promise.resolve('ZIP_DATA'))};
        const packager = new LambdaPackager({packageNameBuilder, scriptExecutor, zipHelper});

        const params = {
            name: 'LAMBDA_NAME',
            envFile: 'ENV_VARS',
            'package-script': 'PACKAGE_SCRIPT'
        };
        return packager.package(params).then(pkg => {
            expect(pkg).to.eql({
                lambdaName: 'LAMBDA_NAME',
                packageData: 'ZIP_DATA',
                packageName: 'PACKAGE_NAME'
            });
            expect(packageNameBuilder.build.args[0]).to.eql(['LAMBDA_NAME']);
            expect(scriptExecutor.execute.args[0]).to.eql([
                'PACKAGE_SCRIPT',
                {
                    cwd: undefined,
                    env: {PACKAGE_OUTPUT_FILE: 'PACKAGE_NAME'},
                    logOutput: false
                }
            ]);
            expect(zipHelper.addDataToZip.args[0][0]).to.eql({
                data: '"ENV_VARS"',
                pathInZip: 'env.json',
                zipPath: 'PACKAGE_NAME'
            });
        });
    });

});
