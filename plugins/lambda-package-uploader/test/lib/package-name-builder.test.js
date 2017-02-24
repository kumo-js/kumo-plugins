
const PackageNameBuilder = require('../../lib/package-name-builder');

describe('LambdaPackageUploader PackageNameBuilder', () => {

    it('builds a package name', () => {
        const builder = new PackageNameBuilder({buildNumber: 'BUILD_NUMBER'});
        expect(builder.build('LAMBDA_NAME')).to.eql('LAMBDA_NAME-BUILD_NUMBER.zip');
    });

});
