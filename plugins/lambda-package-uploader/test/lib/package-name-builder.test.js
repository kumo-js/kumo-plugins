
const PackageNameBuilder = require('../../lib/package-name-builder');

describe('PackageNameBuilder', () => {

    it('builds a package name', () => {
        const builder = new PackageNameBuilder({
            buildNumber: 'BUILD_NUMBER',
            env: 'ENV'
        });
        expect(builder.build('LAMBDA_NAME')).to.eql('ENV-LAMBDA_NAME-BUILD_NUMBER.zip');
    });

});
