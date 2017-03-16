'use strict';

const _ = require('lodash');
const path = require('path');
const tempfile = require('tempfile2');
const Env = require('./env');
const NullEnv = require('./null-env');

class ContextInitializer {

    constructor(params) {
        this._defaultContextInitializer = params.defaultContextInitializer;
        this._settingsBuilder = params.settingsBuilder;
    }

    initialize(context, actionParams) {
        return this._initializeDefaults(context, actionParams)
            .then(context => this._initializeEnv(context))
            .then(context => this._initializeSettings(context))
            .then(context => Object.assign({}, context, {
                generateTempFile: tempfile,
                moduleDir: path.dirname(context.settingsFile)
            }));
    }

    _initializeDefaults(context, actionParams) {
        return this._defaultContextInitializer.initialize(context, actionParams);
    }

    _initializeEnv(context) {
        const env = context.args.env ? new Env(context.args.env) : new NullEnv();
        return Object.assign({}, context, {env});
    }

    _initializeSettings(context) {
        const moduleSettings = context.settings;
        const params = Object.assign(_.pick(context, ['args', 'env', 'kumoSettings']), {moduleSettings});
        return this._settingsBuilder.build(params).then(
            settings => Object.assign({}, context, {settings})
        );
    }
}

module.exports = ContextInitializer;
