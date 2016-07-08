'use strict';

const findUp = require('find-up');

class FileFinder {

    findUpSync(filename, options) {
        const file = findUp.sync(filename, options);
        if (!file) throw new Error(`${filename} not found!`);
        return file;
    }
}

module.exports = FileFinder;
