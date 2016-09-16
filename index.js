'use strict';

const globfs = require('glob-promise');
const path = require('path');

module.exports = {

    prefix: () => '',

    loadPlugins: () => {
        const searchPath = path.join(__dirname, 'plugins', '*', 'index.js');
        return globfs(searchPath).then(files => files.map(f => require(f)));
    }
};
