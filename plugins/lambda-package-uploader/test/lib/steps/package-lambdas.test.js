
const PackageLambdasStep = require('../../../lib/steps/package-lambdas');

describe('LambdaPackageUploader PackageLambdasStep', () => {

    it('packages lambdas', () => {
        const context = {
            settings: {
                packages: ['PACKAGE_CONFIG_1', 'PACKAGE_CONFIG_2']
            }
        };
        const lambdaPackager = {package: stubReturns('PACKAGE_1', 'PACKAGE_2')};
        const step = new PackageLambdasStep({context, lambdaPackager});

        const state = {};
        return step.execute(state).then(newState => {
            expect(newState).to.eql({packages: ['PACKAGE_1', 'PACKAGE_2']});
            expect(lambdaPackager.package.args).to.eql([
                ['PACKAGE_CONFIG_1'], ['PACKAGE_CONFIG_2']
            ]);
        });
    });

});
