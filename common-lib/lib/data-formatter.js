'use strict';

const yaml = require('js-yaml');

class DataFormatter {

    format(data, formatType) {
        const formatter = this._formatters()[formatType];
        if (!formatter) throw new Error(`${formatType} output format not supported.`);
        return Promise.resolve(formatter.format(data));
    }

    _formatters() {
        return {
            yaml: {format: data => yaml.safeDump(data)},
            json: {format: data => JSON.stringify(data, null, 2)}
        };
    }
}

module.exports = DataFormatter;
