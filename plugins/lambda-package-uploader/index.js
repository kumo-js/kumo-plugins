'use strict';

const ActionFactory = require('./lib/action-factory');
const JsonCompatibleFileReader = require('../../common-lib/lib/json-compatible-file-reader');
const JsonSchemaHelper = require('../../common-lib/lib/json-schema-helper');
const DefaultContextInitializer = require('../../common-lib/lib/default-context-initializer');
const ContextInitializer = require('./lib/context-initializer');
const PluginHelper = require('../../common-lib/lib/plugin-helper');

const actionFactory = new ActionFactory();
const fileReader = new JsonCompatibleFileReader();
const jsonSchemaHelper = new JsonSchemaHelper();
const settingsFileConfig = {defaultFilename: 'lambda-packages', required: true};
const defaultContextInitializer = new DefaultContextInitializer({fileReader, settingsFileConfig});
const contextInitializer = new ContextInitializer({defaultContextInitializer, fileReader, jsonSchemaHelper});

module.exports = new PluginHelper({
    contextInitializer: contextInitializer,
    actionDefs: [
        {
            name: 'upload-lambda',
            createAction: context => actionFactory.createUploadLambdaAction(context)
        }
    ]
});
