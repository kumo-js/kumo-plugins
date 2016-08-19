'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

class CfHelper {

    constructor(params) {
        this._cf = params.cf;
    }

    provisionStack(params) {
        return this._searchStack(params.StackName)
            .then(stack => stack ? this._updateStack : this._createStack)
            .then(handlerFn => handlerFn.call(this, params));
    }

    extractOutputs(stackName) {
        return this._findStack(stackName).then(stack =>
            stack.Outputs.reduce((outputs, o) =>
                _.assign(outputs, {[o.OutputKey]: o.OutputValue}), {})
        );
    }

    _findStack(stackName) {
        return this._searchStack(stackName).then(stack => {
            if (!stack) throw new Error(`Stack ${stackName} not found`);
            return stack;
        })
    }

    _searchStack(stackName) {
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

    _waitForCompletion(stackName, desiredState) {
        let options = {interval: 3000, retries: 100};
        return this._searchStack(stackName).then(stack => {
            const status = (stack || {}).StackStatus;
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
