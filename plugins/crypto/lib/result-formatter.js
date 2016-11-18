'use strict';

class ResultFormatter {

    constructor(params) {
        this._args = params.args;
        this._dataFormatter = params.dataFormatter;
    }

    format(value) {
        const formatType = this._args.outputFormat || this._args.inputFormat || 'text';
        return this._dataFormatter.format(value, formatType);
    }
}

module.exports = ResultFormatter;
