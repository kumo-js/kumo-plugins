'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const yaml = require('yaml');

class JsonCompatibleFileReader {

    readJson(file, options) {
        options = options || {};
        const ext = path.extname(file);
        const read = this._readers()[ext];
        if (!read) throw new Error(`Don't know how to read: ${file}`);
        return read(file).catch(err => this._handleReadErr(err, options));
    }

    _readers() {
        return {
            '.js': file => Promise.resolve(require(file)),
            '.yaml': file => this._readFile(file).then(yaml.eval),
            '.json': file => this._parseJsonFile(file),
            '': file => this._parseJsonFile(file)
        };
    }

    _parseJsonFile(file) {
        return this._readFile(file).then(JSON.parse);
    }

    _readFile(file) {
        return fs.readFileAsync(file).then(data => data.toString());
    }

    _handleReadErr(err, options) {
        if (err.code !== 'ENOENT' || !options.ignoreNotFound) throw err;
    }
}

module.exports = JsonCompatibleFileReader;
