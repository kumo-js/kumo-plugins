
const ModuleSettingsResolver = require('../../lib/module-settings-resolver');

describe('LambdaPackageUploader ModuleSettingsResolver', () => {

    it('fully resolves module settings', () => {
        const wrapSettings = sinon.stub().returns('WRAPPED_SETTINGS');
        const fileReader = {
            readAsObject: stubWithArgs(
                ['RESOURCES_FILE'], Promise.resolve('LOADED_RESOURCES'),
                ['CONFIG_FILE'], Promise.resolve('LOADED_CONFIG')
            )
        };
        const jsonSchemaHelper = {derefWith: sinon.stub().returns(Promise.resolve('RESOLVED_SETTINGS'))};
        const resolver = new ModuleSettingsResolver({fileReader, jsonSchemaHelper, wrapSettings});

        const args = {
            'build-number': 'BUILD_NUMBER',
            config: 'CONFIG_FILE',
            env: 'ENV',
            resources: 'RESOURCES_FILE'
        };
        return resolver.resolve('SETTINGS', args).then(moduleSettings => {
            expect(moduleSettings).to.eql('WRAPPED_SETTINGS');
            expect(jsonSchemaHelper.derefWith.args).to.eql([[
                'SETTINGS',
                {
                    buildNumber: 'BUILD_NUMBER',
                    config: 'LOADED_CONFIG',
                    env: 'ENV',
                    resources: 'LOADED_RESOURCES'
                }
            ]]);
            expect(wrapSettings.args).to.eql([[
                {
                    'build-number': 'BUILD_NUMBER',
                    config: 'CONFIG_FILE',
                    env: 'ENV',
                    resources: 'RESOURCES_FILE'
                },
                'RESOLVED_SETTINGS'
            ]]);
        });
    });

    it('does not try to load resources if the file is not specified', () => {
        const wrapSettings = () => 'WRAPPED_SETTINGS';
        const fileReader = {readAsObject: stubWithArgs(['CONFIG_FILE'], Promise.resolve('LOADED_CONFIG'))};
        const jsonSchemaHelper = {derefWith: sinon.stub().returns(Promise.resolve('RESOLVED_SETTINGS'))};
        const resolver = new ModuleSettingsResolver({fileReader, jsonSchemaHelper, wrapSettings});

        const args = {
            'build-number': 'BUILD_NUMBER',
            config: 'CONFIG_FILE',
            env: 'ENV'
        };
        return resolver.resolve('SETTINGS', args).then(moduleSettings => {
            expect(moduleSettings).to.eql('WRAPPED_SETTINGS');
            expect(jsonSchemaHelper.derefWith.args).to.eql([[
                'SETTINGS',
                {
                    buildNumber: 'BUILD_NUMBER',
                    config: 'LOADED_CONFIG',
                    env: 'ENV'
                }
            ]]);
        });
    });

    it('treats `config` argument as optional', () => {
        const wrapSettings = () => 'WRAPPED_SETTINGS';
        const fileReader = {readAsObject: () => Promise.resolve('LOADED_RESOURCES')};
        const jsonSchemaHelper = {derefWith: sinon.stub().returns(Promise.resolve('RESOLVED_SETTINGS'))};
        const resolver = new ModuleSettingsResolver({fileReader, jsonSchemaHelper, wrapSettings});

        const args = {
            'build-number': 'BUILD_NUMBER',
            env: 'ENV',
            resources: 'RESOURCES'
        };
        return resolver.resolve('SETTINGS', args).then(moduleSettings => {
            expect(moduleSettings).to.eql('WRAPPED_SETTINGS');
            expect(jsonSchemaHelper.derefWith.args).to.eql([[
                'SETTINGS',
                {
                    buildNumber: 'BUILD_NUMBER',
                    env: 'ENV',
                    resources: 'LOADED_RESOURCES'
                }
            ]]);
        });
    });

});
