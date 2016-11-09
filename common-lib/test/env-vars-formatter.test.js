
const EnvVarsFormatter = require('../lib/env-vars-formatter');

describe('CommonLib EnvVarsFormatter', () => {

    it('turns object key names into environment variable names with default prefix KUMO', () => {
        const formatter = new EnvVarsFormatter({});
        const envVars = {test: 'VALUE'};
        expect(formatter.format(envVars)).to.eql({KUMO_TEST: 'VALUE'});
    });

    it('replaces hypthens in the key name with underscores', () => {
        const formatter = new EnvVarsFormatter({});
        const envVars = {'test-key--1': 'VALUE'};
        expect(formatter.format(envVars)).to.eql({KUMO_TEST_KEY__1: 'VALUE'});
    });

    it('replaces camel case key name into snake case', () => {
        const formatter = new EnvVarsFormatter({});
        const envVars = {testKeyONE: 'VALUE'};
        expect(formatter.format(envVars)).to.eql({KUMO_TEST_KEY_ONE: 'VALUE'});
    });

    it('uses the given prefix instead of KUMO', () => {
        const options = {prefix: 'PREFIX'};
        const formatter = new EnvVarsFormatter({options});
        const envVars = {test: 'VALUE'};
        expect(formatter.format(envVars)).to.eql({PREFIX_TEST: 'VALUE'});
    });

});
