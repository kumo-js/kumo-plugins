'use strict';

const fs = require('fs');
const EncryptSecretAction = require('./actions/encrypt-secret');
const EncryptSecretsFileAction = require('./actions/encrypt-secrets-file');
const DecryptSecretAction = require('./actions/decrypt-secret');
const DecryptSecretsFileAction = require('./actions/decrypt-secrets-file');
const DecryptSecretsFileItemAction = require('./actions/decrypt-secrets-file-item');
const JsonCompatibleFileReader = require('../../../common-lib/json-compatible-file-reader');
const ProviderFactory = require('./provider-factory');
const SecretSerializer = require('./secret-serializer');
const SecretService = require('./secret-service');
const StoreSecretAction = require('./actions/store-secret');

class ActionFactory {

    createEncryptSecretAction(context) {
        const options = context.options;
        if (options.file) return this._encryptSecretsFileAction(context);
        return this._encryptSecretAction(context);
    }

    createDecryptSecretAction(context) {
        const options = context.options;
        if (options.file && options.item) return this._decryptSecretsFileItemAction(context);
        if (options.file) return this._decryptSecretsFileAction(context);
        return this._decryptSecretAction(context);
    }

    createStoreSecretAction(context) {
        const fileReader = this._fileReader();
        const params = Object.assign(this._commonParams(context), {fileReader, fs});
        return new StoreSecretAction(params);
    }

    _encryptSecretAction(context) {
        return new EncryptSecretAction(this._commonParams(context));
    }

    _encryptSecretsFileAction(context) {
        const fileReader = this._fileReader();
        const params = Object.assign(this._commonParams(context), {fileReader});
        return new EncryptSecretsFileAction(params);
    }

    _decryptSecretAction(context) {
        return new DecryptSecretAction(this._commonParams(context));
    }

    _decryptSecretsFileAction(context) {
        const fileReader = this._fileReader();
        const params = Object.assign(this._commonParams(context), {fileReader});
        return new DecryptSecretsFileAction(params);
    }

    _decryptSecretsFileItemAction(context) {
        const fileReader = this._fileReader();
        const params = Object.assign(this._commonParams(context), {fileReader});
        return new DecryptSecretsFileItemAction(params);
    }

    _commonParams(context) {
        const options = context.options;
        const outputter = this._outputter();
        const secretService = this._secretService(context);
        return {options, outputter, secretService};
    }

    _secretService(context) {
        const secretSerializer = this._secretSerializer();
        const profileSettings = context.settings;
        const providerFactory = this._providerFactory();
        return new SecretService({profileSettings, providerFactory, secretSerializer});
    }

    _fileReader() {
        return new JsonCompatibleFileReader();
    }

    _outputter() {
        return process.stdout;
    }

    _providerFactory() {
        return new ProviderFactory();
    }

    _secretSerializer() {
        return new SecretSerializer();
    }
}

module.exports = ActionFactory;
