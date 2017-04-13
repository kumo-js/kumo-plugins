
const ContextInitializer = require('../../lib/context-initializer');

describe('PackageUploader ContextInitializer', () => {

    it('initialises a context', () => {
        const defaultContextInitializer = {
            initialize: sinon.stub().returns(Promise.resolve({
                args: 'ARGS',
                settings: 'SETTINGS'
            }))
        };
        const moduleSettingsResolver = {resolve: sinon.stub().returns(Promise.resolve('RESOLVED_SETTINGS'))};
        const initializer = new ContextInitializer({defaultContextInitializer, moduleSettingsResolver});
        return initializer.initialize('INITIAL_CONTEXT', 'ACTION_PARAMS').then(context => {
            expect(context).to.eql({
                args: 'ARGS',
                settings: 'RESOLVED_SETTINGS'
            });
            expect(defaultContextInitializer.initialize.args).to.eql([['INITIAL_CONTEXT', 'ACTION_PARAMS']]);
            expect(moduleSettingsResolver.resolve.args).to.eql([['SETTINGS', 'ARGS']]);
        });
    });

});
