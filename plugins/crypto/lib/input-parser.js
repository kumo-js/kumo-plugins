'use strict';

class InputParser {

    constructor(params) {
        this._args = params.args;
        this._dataParser = params.dataParser;
    }

    parse(value) {
        const formatType = this._args.inputFormat || 'text';
        return this._dataParser.parse(value, formatType);
    }
}

module.exports = InputParser;
