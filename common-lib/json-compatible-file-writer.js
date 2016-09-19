'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const yaml = require('js-yaml');

class JsonCompatibleFileWriter {

    writeJson(file, contents) {
        const ext = path.extname(file);
        const write = this._writers()[ext];
        if (!write) throw new Error(`Can't write raw json to file: ${file}`);
        return write(file, contents);
    }

    _writers() {
        return {
            '.yaml': (file, contents) => this._writeFile(file, yaml.safeDump(contents)),
            '.json': (file, contents) => this._writeJsonFile(file, contents),
            '': (file, contents) => this._writeJsonFile(file, contents)
        };
    }

    _writeJsonFile(file, contents) {
        return this._writeFile(file, JSON.parse(contents));
    }

    _writeFile(file, contents) {
        return fs.writeFileAsync(file, contents);
    }
}

module.exports = JsonCompatibleFileWriter;
