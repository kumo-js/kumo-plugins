'use strict';

const ActionFactory = require('./lib/action-factory');
const JsonCompatibleFileReader = require('../../common-lib/lib/json-compatible-file-reader');
const DefaultContextInitializer = require('../../common-lib/lib/default-context-initializer');
const ContextInitializer = require('./lib/context-initializer');
const PluginHelper = require('../../common-lib/lib/plugin-helper');

const actionFactory = new ActionFactory();
const fileReader = new JsonCompatibleFileReader();
const settingsFileConfig = {defaultFilename: 'crypto-profiles', required: false};
const defaultContextInitializer = new DefaultContextInitializer({fileReader, settingsFileConfig});
const contextInitializer = new ContextInitializer({defaultContextInitializer});

module.exports = new PluginHelper({
    contextInitializer: contextInitializer,
    actionDefs: [
        {
            name: 'encrypt',
            createAction: context => actionFactory.createEncryptAction(context)
        },
        {
            name: 'decrypt',
            createAction: context => actionFactory.createDecryptAction(context)
        }
    ]
});
