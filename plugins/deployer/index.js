'use strict';

const ActionFactory = require('./lib/action-factory');
const JsonCompatibleFileReader = require('../../common-lib/lib/json-compatible-file-reader');
const DefaultContextInitializer = require('../../common-lib/lib/default-context-initializer');
const ContextInitializer = require('./lib/context-initializer');
const PluginHelper = require('../../common-lib/lib/plugin-helper');
const SettingsBuilder = require('./lib/settings-builder');

const fileReader = new JsonCompatibleFileReader();
const settingsBuilder = new SettingsBuilder();
const actionFactory = new ActionFactory({fileReader});
const settingsFileConfig = {defaultFilename: 'deployment-settings'};
const defaultContextInitializer = new DefaultContextInitializer({fileReader, settingsFileConfig});
const contextInitializer = new ContextInitializer({defaultContextInitializer, settingsBuilder});

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
