'use strict';

const ActionFactory = require('./lib/action-factory');
const ContextBuilderFactory = require('./lib/context-builder-factory');
const contextBuilderFactory = new ContextBuilderFactory();

function execute(params, createAction) {
    const contextBuilder = contextBuilderFactory.createBuilder(params);
    return contextBuilder.build().then(context => {
        const factory = new ActionFactory({context});
        return createAction(factory).execute();
    });
}

module.exports = {

    actions: () => [
        {
            name: 'deploy-app',
            execute: params => execute(params, factory => factory.createDeployAction())
        },
        {
            name: 'destroy-app',
            execute: params => execute(params, factory => factory.createDestroyAction())
        }
    ]
};
