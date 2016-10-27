'use strict';

const path = require('path');

class ResultFormatter {

    constructor(params) {
        this._dataFormatter = params.dataFormatter;
    }

    format(data, args) {
        const formatType = this._resolveFormatType(args);
        return this._dataFormatter.format(data, formatType);
    }

    _resolveFormatType(args) {
        return args.outputFormat || path.extname(args.file).slice(1);
    }
}

module.exports = ResultFormatter;
