
const PackageStep = require('../../../lib/steps/package');

describe('PackageUploader PackageStep', () => {

    it('packages', () => {
        const context = {
            settings: {
                packages: ['PACKAGE_CONFIG_1', 'PACKAGE_CONFIG_2']
            }
        };
        const packager = {package: stubReturns('PACKAGE_1', 'PACKAGE_2')};
        const step = new PackageStep({context, packager});

        const state = {};
        return step.execute(state).then(newState => {
            expect(newState).to.eql({packages: ['PACKAGE_1', 'PACKAGE_2']});
            expect(packager.package.args).to.eql([
                ['PACKAGE_CONFIG_1'], ['PACKAGE_CONFIG_2']
            ]);
        });
    });

});
