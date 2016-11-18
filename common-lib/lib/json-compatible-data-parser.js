'use strict';

const yaml = require('js-yaml');

class JsonCompatibleDataParser {

    parse(data, format) {
        const parser = this._parsers()[format];
        if (!parser) throw new Error(`Don't know how to parse: ${format}`);
        return parser.parse(data);
    }

    _parsers() {
        return {
            json: {parse: JSON.parse},
            yaml: {parse: yaml.safeLoad},
            text: {parse: data => data.toString()},
            '': {parse: JSON.parse}
        };
    }
}

module.exports = JsonCompatibleDataParser;
