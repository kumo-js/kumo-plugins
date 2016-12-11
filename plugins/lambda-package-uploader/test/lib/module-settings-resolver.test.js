
const ModuleSettingsResolver = require('../../lib/module-settings-resolver');

describe('LambdaPackageUploader ModuleSettingsResolver', () => {

    it('fully resolves module settings', () => {
        const wrapSettings = sinon.stub().returns('WRAPPED_SETTINGS');
        const fileReader = {readAsObject: sinon.stub().returns(Promise.resolve('LOADED_RESOURCES'))};
        const jsonSchemaHelper = {derefWith: sinon.stub().returns(Promise.resolve('RESOLVED_SETTINGS'))};
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
                'RESOLVED_SETTINGS'
            ]]);
        });
    });

    it('does not try to load resources if the file is not specified', () => {
        const wrapSettings = () => 'WRAPPED_SETTINGS';
        const fileReader = {readAsObject: sinon.spy()};
        const jsonSchemaHelper = {derefWith: sinon.stub().returns(Promise.resolve('RESOLVED_SETTINGS'))};
        const resolver = new ModuleSettingsResolver({fileReader, jsonSchemaHelper, wrapSettings});

        const args = {
            'build-number': 'BUILD_NUMBER',
            config: '{"CONFIG_KEY":".."}',
            env: 'ENV'
        };
        return resolver.resolve('SETTINGS', args).then(moduleSettings => {
            expect(moduleSettings).to.eql('WRAPPED_SETTINGS');
            expect(fileReader.readAsObject.callCount).to.eql(0);
            expect(jsonSchemaHelper.derefWith.args).to.eql([[
                'SETTINGS',
                {
                    buildNumber: 'BUILD_NUMBER',
                    config: {CONFIG_KEY: '..'},
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
