
const PackageNameBuilder = require('../../lib/package-name-builder');

describe('PackageUploader PackageNameBuilder', () => {

    it('builds a package name', () => {
        const builder = new PackageNameBuilder({buildNumber: 'BUILD_NUMBER'});
        expect(builder.build('PACKAGE_NAME')).to.eql('PACKAGE_NAME-BUILD_NUMBER.zip');
    });

});
