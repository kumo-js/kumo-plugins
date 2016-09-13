'use strict';

const ActionFactory = require('./lib/action-factory');
const JsonCompatibleFileReader = require('../common-lib/json-compatible-file-reader');
const DefaultContextInitializer = require('../common-lib/default-context-initializer');
const ContextInitializer = require('./lib/context-initializer');
const PluginHelper = require('../common-lib/plugin-helper');

const actionFactory = new ActionFactory();
const fileReader = new JsonCompatibleFileReader();
const defaultSettingsFilename = 'deploy-settings.json';
const defaultContextInitializer = new DefaultContextInitializer({defaultSettingsFilename, fileReader});
const contextInitializer = new ContextInitializer({defaultContextInitializer});

module.exports = new PluginHelper({
    contextInitializer: contextInitializer,
    actionDefs: [
        {
            name: 'deploy-app',
            createAction: context => actionFactory.createDeployAction(context)
        },
        {
            name: 'destroy-app',
            createAction: context => actionFactory.createDestroyAction(context)
        }
    ]
});