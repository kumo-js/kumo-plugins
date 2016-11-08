'use strict';

const ActionFactory = require('./lib/action-factory');
const JsonCompatibleFileReader = require('../../common-lib/json-compatible-file-reader');
const JsonSchemaHelper = require('../../common-lib/json-schema-helper');
const DefaultContextInitializer = require('../../common-lib/default-context-initializer');
const ContextInitializer = require('./lib/context-initializer');
const PluginHelper = require('../../common-lib/plugin-helper');
const SettingsBuilder = require('./lib/settings-builder');

const fileReader = new JsonCompatibleFileReader();
const jsonSchemaHelper = new JsonSchemaHelper();
const settingsBuilder = new SettingsBuilder({jsonSchemaHelper});
const actionFactory = new ActionFactory({fileReader, settingsBuilder});
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
