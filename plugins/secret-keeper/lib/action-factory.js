'use strict';

const fs = require('fs');
const EncryptValueAction = require('./actions/encrypt-value');
const EncryptFileAction = require('./actions/encrypt-file');
const DataFormatter = require('../../../common-lib/data-formatter');
const DecryptValueAction = require('./actions/decrypt-value');
const DecryptFileAction = require('./actions/decrypt-file');
const DecryptFileItemAction = require('./actions/decrypt-file-item');
const JsonCompatibleFileReader = require('../../../common-lib/json-compatible-file-reader');
const ProviderFactory = require('./provider-factory');
const ResultFormatter = require('./result-formatter');
const SecretSerializer = require('./secret-serializer');
const SecretService = require('./secret-service');
const StoreSecretAction = require('./actions/store-secret');

class ActionFactory {

    createEncryptAction(context) {
        const args = context.args;
        if (args.file) return this._encryptFileAction(context);
        return this._encryptValueAction(context);
    }

    createDecryptAction(context) {
        const args = context.args;
        if (args.file && args.item) return this._decryptFileItemAction(context);
        if (args.file) return this._decryptFileAction(context);
        return this._decryptValueAction(context);
    }

    createStoreSecretAction(context) {
        const args = context.args;
        const fileReader = this._fileReader();
        const resultFormatter = this._resultFormatter();
        const secretService = this._secretService(context);
        return new StoreSecretAction({args, fileReader, fs, resultFormatter, secretService});
    }

    _encryptValueAction(context) {
        const args = context.args;
        const secretService = this._secretService(context);
        const stdOut = this._stdOut();
        return new EncryptValueAction({args, secretService, stdOut});
    }

    _encryptFileAction(context) {
        const args = context.args;
        const fileReader = this._fileReader();
        const resultFormatter = this._resultFormatter();
        const secretService = this._secretService(context);
        const stdOut = this._stdOut();
        return new EncryptFileAction({args, fileReader, resultFormatter, secretService, stdOut});
    }

    _decryptValueAction(context) {
        const args = context.args;
        const secretService = this._secretService(context);
        const stdOut = this._stdOut();
        return new DecryptValueAction({args, secretService, stdOut});
    }

    _decryptFileAction(context) {
        const args = context.args;
        const fileReader = this._fileReader();
        const resultFormatter = this._resultFormatter();
        const secretService = this._secretService(context);
        const stdOut = this._stdOut();
        return new DecryptFileAction({args, fileReader, resultFormatter, secretService, stdOut});
    }

    _decryptFileItemAction(context) {
        const args = context.args;
        const fileReader = this._fileReader();
        const secretService = this._secretService(context);
        const stdOut = this._stdOut();
        return new DecryptFileItemAction({args, fileReader, secretService, stdOut});
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

    _providerFactory() {
        return new ProviderFactory();
    }

    _resultFormatter() {
        const dataFormatter = new DataFormatter();
        return new ResultFormatter({dataFormatter});
    }

    _secretSerializer() {
        return new SecretSerializer();
    }

    _stdOut() {
        return process.stdout;
    }
}

module.exports = ActionFactory;
