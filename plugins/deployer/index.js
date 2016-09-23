'use strict';

const ActionFactory = require('./lib/action-factory');
const JsonCompatibleFileReader = require('../../common-lib/json-compatible-file-reader');
const DefaultContextInitializer = require('../../common-lib/default-context-initializer');
const ContextInitializer = require('./lib/context-initializer');
const PluginHelper = require('../../common-lib/plugin-helper');

const actionFactory = new ActionFactory();
const fileReader = new JsonCompatibleFileReader();
const settingsFileConfig = {defaultFilename: 'deployment-settings.json'};
const defaultContextInitializer = new DefaultContextInitializer({fileReader, settingsFileConfig});
const contextInitializer = new ContextInitializer({defaultContextInitializer});

module.exports = new PluginHelper({
    contextInitializer: contextInitializer,
    actionDefs: [
        {
            name: 'deploy-module',
            createAction: context => actionFactory.createDeployAction(context)
        },
        {
            name: 'destroy-module',
            createAction: context => actionFactory.createDestroyAction(context)
        }
    ]
});
