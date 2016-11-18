'use strict';

class CryptAction {

    constructor(params) {
        this._inputReader = params.inputReader;
        this._inputParser = params.inputParser;
        this._cryptTransformerFactory = params.cryptTransformerFactory;
        this._resultFormatter = params.resultFormatter;
        this._resultWriter = params.resultWriter;
    }

    execute() {
        return this._inputReader.read()
            .then(value => this._inputParser.parse(value))
            .then(parsedValue => this._transformValue(parsedValue))
            .then(transformedValue => this._resultFormatter.format(transformedValue))
            .then(formattedValue => this._resultWriter.write(formattedValue));
    }

    _transformValue(value) {
        const cryptTransformer = this._cryptTransformerFactory.createTransformer(typeof value);
        return cryptTransformer.transform(value);
    }
}

module.exports = CryptAction;
