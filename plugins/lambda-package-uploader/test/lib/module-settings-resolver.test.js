
const ModuleSettingsResolver = require('../../lib/module-settings-resolver');

describe('LambdaPackageUploader ModuleSettingsResolver', () => {

    it('fully resolves module settings', () => {
        const wrapSettings = sinon.stub().returns('WRAPPED_SETTINGS');
        const fileReader = {readAsObject: sinon.stub().returns(Promise.resolve('LOADED_RESOURCES'))};
        const jsonSchemaHelper = {derefWith: sinon.stub().returns(Promise.resolve('MODULE_SETTINGS'))};
        const resolver = new ModuleSettingsResolver({fileReader, jsonSchemaHelper, wrapSettings});

        const args = {
            'build-number': 'BUILD_NUMBER',
            config: '{"CONFIG_KEY":".."}',
            env: 'ENV',
            resources: 'RESOURCES'
        };
        return resolver.resolve('SETTINGS', args).then(moduleSettings => {
            expect(moduleSettings).to.eql('WRAPPED_SETTINGS');
            expect(fileReader.readAsObject.args).to.eql([['RESOURCES']]);
            expect(jsonSchemaHelper.derefWith.args).to.eql([[
                'SETTINGS',
                {
                    buildNumber: 'BUILD_NUMBER',
                    config: {CONFIG_KEY: '..'},
                    env: 'ENV',
                    resources: 'LOADED_RESOURCES'
                }
            ]]);
            expect(wrapSettings.args).to.eql([[
                {
                    'build-number': 'BUILD_NUMBER',
                    config: '{"CONFIG_KEY":".."}',
                    env: 'ENV',
                    resources: 'RESOURCES'
                },
                'MODULE_SETTINGS'
            ]]);
        });
    });

});
