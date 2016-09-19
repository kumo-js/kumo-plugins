'use strict';

const EncryptSecretAction = require('./actions/encrypt-secret');
const EncryptSecretsFileAction = require('./actions/encrypt-secrets-file');
const DecryptSecretAction = require('./actions/decrypt-secret');
const DecryptSecretsFileAction = require('./actions/decrypt-secrets-file');
const DecryptSecretsFileItemAction = require('./actions/decrypt-secrets-file-item');
const JsonCompatibleFileReader = require('../../../common-lib/json-compatible-file-reader');
const JsonCompatibleFileWriter = require('../../../common-lib/json-compatible-file-writer');
const ProviderFactory = require('./provider-factory');
const SecretSerializer = require('./secret-serializer');
const SecretService = require('./secret-service');
const StoreSecretAction = require('./actions/store-secret');

class ActionFactory {

    createEncryptSecretAction(context) {
        const args = context.args;
        if (args.file) return this._encryptSecretsFileAction(context);
        return this._encryptSecretAction(context);
    }

    createDecryptSecretAction(context) {
        const args = context.args;
        if (args.file && args.item) return this._decryptSecretsFileItemAction(context);
        if (args.file) return this._decryptSecretsFileAction(context);
        return this._decryptSecretAction(context);
    }

    createStoreSecretAction(context) {
        const fileReader = this._fileReader();
        const fileWriter = this._fileWriter();
        const params = Object.assign(this._commonParams(context), {fileReader, fileWriter});
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
        const args = context.args;
        const outputter = this._outputter();
        const secretService = this._secretService(context);
        return {args, outputter, secretService};
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

    _fileWriter() {
        return new JsonCompatibleFileWriter();
    }

    _outputter() {
        return {write: console.log};
    }

    _providerFactory() {
        return new ProviderFactory();
    }

    _secretSerializer() {
        return new SecretSerializer();
    }
}

module.exports = ActionFactory;
