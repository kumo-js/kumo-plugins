'use strict';

const _ = require('lodash');

class CfHelper {

    constructor(params) {
        this._cf = params.cf;
    }

    provisionStack(params, options) {
        return this._checkStackExists(params.StackName)
            .then(exists => exists ? this._updateStack : this._createStack)
            .then(handlerFn => handlerFn(params, options));
    }

    extractOutputs(stackName) {
        return this._getStack(stackName).then(stack =>
            stack.Outputs.reduce((outputs, o) =>
                _.assign(outputs, {[o.OutputKey]: o.OutputValue}), {})
        );
    }

    _checkStackExists(stackName) {
        return this._cf.describeStacks({StackName: stackName}).promise()
            .then(data => data.stacks.length > 0);
    }

    _getStack(stackName) {
        return this._cf.describeStacks({StackName: stackName}).promise().then(data => {
            const stack = _.find(data.stacks, s => s.StackName === stackName);
            if (!stack) throw new Error(`Stack ${stackName} not found`);
            return stack;
        });
    }

    _createStack(params, options) {
        return this._cf.createStack(params).promise().then(data => {
            return this._waitForCompletion(params.StackName, 'CREATE_COMPLETE', options)
                .then(() => data.StackId);
        });
    }

    _updateStack(params, options) {
        return this._cf.updateStack(params).promise().then(() => {
            return this._waitForCompletion(params.StackName, 'UPDATE_COMPLETE', options);
        });
    }

    _waitForCompletion(stackName, desiredState, options) {
        options = _.assign({interval: 10, retries: 60}, options);
        return this._getStack(stackName).then(stack => {
            const status = stack.StackStatus;
            if (status === desiredState) return;
            if (status.match(/FAILED|COMPLETE$/i)) throw new Error('Stack operation not successful');
            if (options.retries === 0) throw new Error('Timed out waiting for stack completion');
            return Promise.delay(options.interval).then(() => {
                options = _.assign({}, options, {retries: options.retries - 1});
                return this._waitForCompletion(stackName, desiredState, options)
            });
        });
    }
}

module.exports = CfHelper;
