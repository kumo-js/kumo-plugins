'use strict';

const ActionFactory = require('./lib/action-factory');
const JsonCompatibleFileReader = require('../../common-lib/json-compatible-file-reader');
const DefaultContextInitializer = require('../../common-lib/default-context-initializer');
const ContextInitializer = require('./lib/context-initializer');
const PluginHelper = require('../../common-lib/plugin-helper');

const actionFactory = new ActionFactory();
const fileReader = new JsonCompatibleFileReader();
const settingsFileConfig = {defaultFilename: 'secret-profiles', required: false};
const defaultContextInitializer = new DefaultContextInitializer({fileReader, settingsFileConfig});
const contextInitializer = new ContextInitializer({defaultContextInitializer});

module.exports = new PluginHelper({
    contextInitializer: contextInitializer,
    actionDefs: [
        {
            name: 'encrypt-secret',
            createAction: context => actionFactory.createEncryptSecretAction(context)
        },
        {
            name: 'decrypt-secret',
            createAction: context => actionFactory.createDecryptSecretAction(context)
        },
        {
            name: 'store-secret-item',
            createAction: context => actionFactory.createStoreSecretAction(context)
        }
    ]
});
