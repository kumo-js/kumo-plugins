'use strict';

const runScript = require('command-promise');
const AwsHelpers = require('../../../common-lib/lib/aws-helpers');
const CollectDeploymentOutputsStep = require('./action-steps/collect-deployment-outputs');
const CollectDeploymentConfigStep = require('./action-steps/collect-deployment-config');
const CollectDataSourceDataStep = require('./action-steps/collect-data-source-data');
const DataSourceFactory = require('./data-source-factory');
const DeploymentScriptExecutor = require('./deployment-script-executor');
const ExpandTaskDefsStep = require('./action-steps/expand-task-defs');
const ExecuteTasksStep = require('./action-steps/execute-tasks');
const EnvVarsFormatter = require('../../../common-lib/lib/env-vars-formatter');
const InitialiseOutputsStoreStep = require('./action-steps/initialise-outputs-store');
const ObjectResolver = require('../../../common-lib/lib/object-resolver');
const OutputsStoreFactory = require('./outputs-store-factory');
const SanitizeOutputsStep = require('./action-steps/sanitize-outputs');
const ScriptExecutor = require('../../../common-lib/lib/script-executor');
const StepsExecutor = require('../../../common-lib/lib/steps-executor');
const TaskServiceFactory = require('./task-service-factory');
const UndoTasksStep = require('./action-steps/undo-tasks');

class ActionFactory {

    constructor(params) {
        this._fileReader = params.fileReader;
        this._settingsBuilder = params.settingsBuilder;
    }

    createDeployAction(context) {
        return new StepsExecutor({
            steps: [
                this._collectDeploymentConfigStep(context),
                this._initialiseOutputsStoreStep(context),
                this._collectDeploymentOutputsStep(),
                this._collectDataSourceDataStep(context),
                this._expandTaskDefsStep(context),
                this._executeTasksStep(context),
                this._sanitizeOutputsStep(context)
            ]
        });
    }

    createDestroyAction(context) {
        return new StepsExecutor({
            steps: [
                this._collectDeploymentOutputsStep(context),
                this._collectDeploymentConfigStep(context),
                this._expandTaskDefsStep(context),
                this._undoTasksStep(context)
            ]
        });
    }

    _initialiseOutputsStoreStep(context) {
        const objectResolver = this._objectResolver();
        const outputsStoreFactory = new OutputsStoreFactory();
        return new InitialiseOutputsStoreStep({context, objectResolver, outputsStoreFactory});
    }

    _collectDeploymentOutputsStep() {
        return new CollectDeploymentOutputsStep();
    }

    _collectDeploymentConfigStep(context) {
        const objectResolver = this._objectResolver();
        const envVarsFormatter = new EnvVarsFormatter({});
        const scriptExecutor = this._scriptExecutor(context);
        const deploymentScriptExecutor = new DeploymentScriptExecutor(
            {context, envVarsFormatter, scriptExecutor}
        );
        return new CollectDeploymentConfigStep({context, deploymentScriptExecutor, objectResolver});
    }

    _collectDataSourceDataStep(context) {
        const dataSourceFactory = new DataSourceFactory();
        const objectResolver = this._objectResolver();
        return new CollectDataSourceDataStep({context, dataSourceFactory, objectResolver});
    }

    _expandTaskDefsStep(context) {
        return new ExpandTaskDefsStep({context});
    }

    _executeTasksStep(context) {
        const taskServiceFactory = this._taskServiceFactory(context);
        return new ExecuteTasksStep({context, taskServiceFactory});
    }

    _undoTasksStep(context) {
        const taskServiceFactory = this._taskServiceFactory(context);
        return new UndoTasksStep({taskServiceFactory});
    }

    _sanitizeOutputsStep() {
        return new SanitizeOutputsStep();
    }

    _scriptExecutor(context) {
        const logger = context.logger;
        return new ScriptExecutor({logger, runScript});
    }

    _taskServiceFactory(context) {
        return new TaskServiceFactory({context});
    }

    _awsHelpers() {
        return new AwsHelpers();
    }

    _objectResolver() {
        return new ObjectResolver();
    }
}

module.exports = ActionFactory;
