
const Packager = require('../../lib/packager');

describe('PackageUploader Packager', () => {

    it('packages', () => {
        const fs = {readFileAsync: sinon.stub().returns(Promise.resolve('ZIP_DATA'))};
        const packageNameBuilder = {build: sinon.stub().returns('PACKAGE_NAME')};
        const scriptExecutor = {execute: sinon.stub().returns(Promise.resolve())};
        const generateTempFilePath = sinon.stub().returns('/PATH/TO/TEMP_FILE.zip');
        const packager = new Packager({fs, packageNameBuilder, scriptExecutor, generateTempFilePath});

        const params = {
            name: 'PACKAGE_NAME',
            'package-script': 'PACKAGE_SCRIPT'
        };
        return packager.package(params).then(pkg => {
            expect(pkg).to.eql({
                originalPackageName: 'PACKAGE_NAME',
                packageData: 'ZIP_DATA',
                finalPackageName: 'PACKAGE_NAME'
            });
            expect(packageNameBuilder.build.args[0]).to.eql(['PACKAGE_NAME']);
            expect(generateTempFilePath.args[0]).to.eql([{ext: '.zip'}]);
            expect(scriptExecutor.execute.args[0]).to.eql([
                'PACKAGE_SCRIPT',
                {
                    cwd: undefined,
                    envVars: {KUMO_PACKAGE_OUTPUT_FILE: '/PATH/TO/TEMP_FILE.zip'},
                    logOutput: false
                }
            ]);
            expect(fs.readFileAsync.args[0]).to.eql(['/PATH/TO/TEMP_FILE.zip']);
        });
    });

});
