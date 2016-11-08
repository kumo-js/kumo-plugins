'use strict';

const ActionFactory = require('./lib/action-factory');
const ContextInitializer = require('./lib/context-initializer');
const PluginHelper = require('../../common-lib/plugin-helper');

const actionFactory = new ActionFactory();

module.exports = new PluginHelper({
    contextInitializer: new ContextInitializer(),
    actionDefs: [
        {
            name: 'upload-cert',
            createAction: context => actionFactory.createUploadCertAction(context)
        }
    ]
});
