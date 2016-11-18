'use strict';

const getStdIn = require('get-stdin');
const CryptAction = require('./crypt-action');
const CryptTransformerFactory = require('./crypt-transformer-factory');
const DataFormatter = require('../../../common-lib/lib/data-formatter');
const DecryptTransformer = require('./transformers/decrypt-transformer');
const EncryptTransformer = require('./transformers/encrypt-transformer');
const EncryptedValueSerializer = require('./encrypted-value-serializer');
const JsonCompatibleDataParser = require('../../../common-lib/lib/json-compatible-data-parser');
const InputParser = require('./input-parser');
const ProviderFactory = require('./provider-factory');
const ResultFormatter = require('./result-formatter');

class ActionFactory {

    createEncryptAction(context) {
        const encryptTransformer = this._encryptTransformer(context);
        return this._cryptAction(context, encryptTransformer);
    }

    createDecryptAction(context) {
        const decryptTransformer = this._decryptTransformer(context);
        return this._cryptAction(context, decryptTransformer);
    }

    _cryptAction(context, cryptTransformer) {
        const args = context.args;
        const inputReader = this._stdInReader();
        const inputParser = this._inputParser(args);
        const cryptTransformerFactory = this._cryptTransformerFactory(args, cryptTransformer);
        const resultFormatter = this._resultFormatter(args);
        const resultWriter = this._stdOutWriter();

        return new CryptAction({
            inputReader, inputParser, cryptTransformerFactory, resultFormatter, resultWriter
        });
    }

    _cryptTransformerFactory(args, cryptTransformer) {
        return new CryptTransformerFactory({args, cryptTransformer});
    }

    _decryptTransformer() {
        const encryptedValueSerializer = this._encryptedValueSerializer();
        const providerFactory = this._providerFactory();
        return new DecryptTransformer({encryptedValueSerializer, providerFactory});
    }

    _encryptTransformer(context) {
        const args = context.args;
        const encryptedValueSerializer = this._encryptedValueSerializer();
        const profileSettings = context.settings;
        const providerFactory = this._providerFactory();
        return new EncryptTransformer({args, encryptedValueSerializer, profileSettings, providerFactory});
    }

    _encryptedValueSerializer() {
        return new EncryptedValueSerializer();
    }

    _inputParser(args) {
        const dataParser = new JsonCompatibleDataParser();
        return new InputParser({args, dataParser});
    }

    _providerFactory() {
        return new ProviderFactory();
    }

    _resultFormatter(args) {
        const dataFormatter = new DataFormatter();
        return new ResultFormatter({args, dataFormatter});
    }

    _stdInReader() {
        return {read: getStdIn};
    }

    _stdOutWriter() {
        return process.stdout;
    }
}

module.exports = ActionFactory;
