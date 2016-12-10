
const ContextInitializer = require('../../lib/context-initializer');
const Settings = require('../../lib/settings');

describe('LambdaPackageUploader ContextInitializer', () => {

    it('initialises a context', () => {
        const defaultContextInitializer = {
            initialize: sinon.stub().returns(Promise.resolve({
                args: {
                    'build-number': 'BUILD_NUMBER',
                    config: '{"CONFIG_KEY":".."}',
                    env: 'ENV',
                    resources: 'RESOURCES'
                },
                settings: 'SETTINGS'
            }))
        };
        const fileReader = {readAsObject: sinon.stub().returns(Promise.resolve('LOADED_RESOURCES'))};
        const jsonSchemaHelper = {derefWith: sinon.stub().returns(Promise.resolve('MODULE_SETTINGS'))};
        const initializer = new ContextInitializer({defaultContextInitializer, fileReader, jsonSchemaHelper});
        return initializer.initialize('INITIAL_CONTEXT', 'ACTION_PARAMS').then(context => {
            expect(context).to.eql({
                args: {
                    'build-number': 'BUILD_NUMBER',
                    config: '{"CONFIG_KEY":".."}',
                    env: 'ENV',
                    resources: 'RESOURCES'
                },
                settings: new Settings({
                    moduleSettings: 'MODULE_SETTINGS',
                    args: {
                        'build-number': 'BUILD_NUMBER',
                        config: '{"CONFIG_KEY":".."}',
                        env: 'ENV',
                        resources: 'RESOURCES'
                    }
                })
            });
            expect(defaultContextInitializer.initialize.args).to.eql([['INITIAL_CONTEXT', 'ACTION_PARAMS']]);
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
        });
    });

});
