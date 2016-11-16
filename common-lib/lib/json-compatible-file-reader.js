'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const yaml = require('js-yaml');

class JsonCompatibleFileReader {

    readAsObject(file, options) {
        options = options || {};
        const ext = path.extname(file);
        const read = this._readers()[ext];
        if (!read) throw new Error(`Don't know how to read: ${file}`);
        return read(file).catch(err => this._handleReadErr(err, options));
    }

    _readers() {
        return {
            '.js': file => Promise.resolve(this._requireFile(file)),
            '.yaml': file => this._readFile(file).then(yaml.safeLoad),
            '.json': file => this._parseJsonFile(file),
            '': file => this._parseJsonFile(file)
        };
    }

    _requireFile(file) {
        const isAbsolute = path.isAbsolute(file);
        const absolutePath = isAbsolute ? file : path.join(process.cwd(), file);
        return require(absolutePath);
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
