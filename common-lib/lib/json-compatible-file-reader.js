'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const JsonCompatibleDataParser = require('./json-compatible-data-parser');

class JsonCompatibleFileReader {

    constructor(params) {
        params = params || {};
        this._jsonCompatibleDataParser =
            params.jsonCompatibleDataParser || new JsonCompatibleDataParser();
    }

    readAsObject(file, options) {
        options = options || {};
        const extName = this._fileExt(file);
        const isJsFile = extName === '.js';
        const handler = isJsFile ? this._parseJsFile : this._parseDataFile;
        return handler.call(this, file).catch(err => this._handleReadErr(err, options));
    }

    _parseJsFile(file) {
        const isAbsolute = path.isAbsolute(file);
        const absolutePath = isAbsolute ? file : path.join(process.cwd(), file);
        return Promise.resolve(require(absolutePath));
    }

    _parseDataFile(file) {
        const format = this._fileExt(file).slice(1);
        return this._readFile(file).then(data =>
            this._jsonCompatibleDataParser.parse(data, format)
        );
    }

    _readFile(file) {
        return fs.readFileAsync(file).then(data => data.toString());
    }

    _fileExt(file) {
        return path.extname(file);
    }

    _handleReadErr(err, options) {
        if (err.code !== 'ENOENT' || !options.ignoreNotFound) throw err;
    }
}

module.exports = JsonCompatibleFileReader;
