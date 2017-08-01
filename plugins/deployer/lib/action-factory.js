'use strict';

const runScript = require('command-promise');
const AwsHelpers = require('../../../common-lib/lib/aws-helpers');
const CollectDeploymentOutputsStep = require('./action-steps/collect-deployment-outputs');
const CollectDeploymentConfigStep = require('./action-steps/collect-deployment-config');
const CollectDataSourceDataStep = require('./action-steps/collect-data-source-data');
const DataSourceFactory = require('./data-source-factory');
const DeploymentScriptExecutor = require('./deployment-script-executor');
const ExecuteTasksStep = require('./action-steps/execute-tasks');
const InitialiseOutputsStoreStep = require('./action-steps/initialise-outputs-store');
const OutputsStoreFactory = require('./outputs-store-factory');
const SanitizeOutputsStep = require('./action-steps/sanitize-outputs');
const ScriptExecutor = require('../../../common-lib/lib/script-executor');
const StepsExecutor = require('../../../common-lib/lib/steps-executor');
const TaskFactory = require('./task-factory');
const UndoTasksStep = require('./action-steps/undo-tasks');

class ActionFactory {

    constructor(params) {
        this._fileReader = params.fileReader;
    }

    createDeployAction(context) {
        return new StepsExecutor({
            steps: [
                this._collectDeploymentConfigStep(context),
                this._initialiseOutputsStoreStep(context),
                this._collectDeploymentOutputsStep(context),
                this._collectDataSourceDataStep(context),
                this._executeTasksStep(context),
                this._sanitizeOutputsStep(context)
            ]
        });
    }

    createDestroyAction(context) {
        return new StepsExecutor({
            steps: [
                this._collectDeploymentConfigStep(context),
                this._initialiseOutputsStoreStep(context),
                this._collectDeploymentOutputsStep(context),
                this._collectDataSourceDataStep(context),
                this._undoTasksStep(context)
            ]
        });
    }

    _initialiseOutputsStoreStep(context) {
        const outputsStoreFactory = new OutputsStoreFactory();
        return new InitialiseOutputsStoreStep({context, outputsStoreFactory});
    }

    _collectDeploymentOutputsStep(context) {
        return new CollectDeploymentOutputsStep({context});
    }

    _collectDeploymentConfigStep(context) {
        const scriptExecutor = this._scriptExecutor(context);
        const deploymentScriptExecutor = new DeploymentScriptExecutor({scriptExecutor});
        return new CollectDeploymentConfigStep({context, deploymentScriptExecutor});
    }

    _collectDataSourceDataStep(context) {
        const dataSourceFactory = new DataSourceFactory();
        return new CollectDataSourceDataStep({context, dataSourceFactory});
    }

    _executeTasksStep(context) {
        const taskFactory = this._taskFactory(context);
        return new ExecuteTasksStep({context, taskFactory});
    }

    _undoTasksStep(context) {
        const taskFactory = this._taskFactory(context);
        return new UndoTasksStep({context, taskFactory});
    }

    _sanitizeOutputsStep() {
        return new SanitizeOutputsStep();
    }

    _scriptExecutor(context) {
        const logger = context.logger;
        return new ScriptExecutor({logger, runScript});
    }

    _taskFactory(context) {
        return new TaskFactory({context});
    }

    _awsHelpers() {
        return new AwsHelpers();
    }
}

module.exports = ActionFactory;
