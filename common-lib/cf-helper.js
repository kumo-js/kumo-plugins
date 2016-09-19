'use strict';

const Promise = require('bluebird');

class CfHelper {

    constructor(params) {
        this._cf = params.cf;
    }

    findStack(stackName) {
        return this.searchStack(stackName).then(stack => {
            if (!stack) throw new Error(`Stack ${stackName} not found`);
            return stack;
        });
    }

    extractOutputs(stackName) {
        return this.findStack(stackName).then(stack =>
            stack.Outputs.reduce((outputs, o) =>
                Object.assign(outputs, {[o.OutputKey]: o.OutputValue}), {})
        );
    }

    deleteStack(stackName) {
        const params = {StackName: stackName};
        return this._cf.deleteStack(params).promise().then(() =>
            this._waitForCompletion(params.StackName, '')
        );
    }

    provisionStack(params) {
        return this.searchStack(params.StackName)
            .then(stack => stack ? this._updateStack : this._createStack)
            .then(handlerFn => handlerFn.call(this, params));
    }

    searchStack(stackName) {
        return this._cf.describeStacks({StackName: stackName}).promise().then(
            data => data.Stacks[0],
            err => {
                const notExistErr = err.message.match(/does not exist/i);
                if (err.code === 'ValidationError' && notExistErr) return null;
                throw err;
            }
        );
    }

    _createStack(params) {
        return this._cf.createStack(params).promise().then(data => {
            return this._waitForCompletion(params.StackName, 'CREATE_COMPLETE')
                .then(() => data.StackId);
        });
    }

    _updateStack(params) {
        return this._cf.updateStack(params).promise().then(
            () => this._waitForCompletion(params.StackName, 'UPDATE_COMPLETE'),
            err => {
                const noUpdatesErr = err.message.match(/no updates are to be performed/i);
                if (err.code === 'ValidationError' && noUpdatesErr) return null;
                throw err;
            }
        );
    }

    _waitForCompletion(stackName, desiredState, options) {
        options = Object.assign({interval: 3000, retries: 100}, options);
        return this.searchStack(stackName).then(stack => {
            const status = (stack || {}).StackStatus || '';
            if (status === desiredState) return;
            if (status.match(/FAILED|COMPLETE$/i)) throw new Error('Stack operation not successful');
            if (options.retries === 0) throw new Error('Timed out waiting for stack completion');
            return Promise.delay(options.interval).then(() => {
                options = Object.assign({}, options, {retries: options.retries - 1});
                return this._waitForCompletion(stackName, desiredState, options);
            });
        });
    }
}

module.exports = CfHelper;
