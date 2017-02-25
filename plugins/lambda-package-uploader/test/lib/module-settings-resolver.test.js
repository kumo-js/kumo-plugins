
const ModuleSettingsResolver = require('../../lib/module-settings-resolver');

describe('LambdaPackageUploader ModuleSettingsResolver', () => {

    it('fully resolves module settings', () => {
        const wrapSettings = sinon.stub().returns('WRAPPED_SETTINGS');
        const jsonSchemaHelper = {derefWith: sinon.stub().returns(Promise.resolve('RESOLVED_SETTINGS'))};
        const resolver = new ModuleSettingsResolver({jsonSchemaHelper, wrapSettings});

        const args = {
            'build-number': 'BUILD_NUMBER',
            'upload-bucket': 'UPLOAD_BUCKET'
        };
        return resolver.resolve('SETTINGS', args).then(moduleSettings => {
            expect(moduleSettings).to.eql('WRAPPED_SETTINGS');
            expect(jsonSchemaHelper.derefWith.args).to.eql([[
                'SETTINGS',
                {buildNumber: 'BUILD_NUMBER'}
            ]]);
            expect(wrapSettings.args).to.eql([[
                {
                    'build-number': 'BUILD_NUMBER',
                    'upload-bucket': 'UPLOAD_BUCKET'
                },
                'RESOLVED_SETTINGS'
            ]]);
        });
    });

});
