'use strict';

const ActionFactory = require('./lib/action-factory');
const ContextFactory = require('./lib/context-factory');
const JsonCompatibleFileReader = require('../common-lib/json-compatible-file-reader');
const PluginActionsBuilder = require('../common-lib/plugin-actions-builder');

const fileReader = new JsonCompatibleFileReader();
const actionFactory = new ActionFactory();
const contextFactory = new ContextFactory({fileReader});

module.exports = new PluginActionsBuilder({
    contextFactory: contextFactory,
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
}).build();
