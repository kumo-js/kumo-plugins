'use strict';

const PLUGINS = [
    'app-deployer'
];

module.exports = {

    prefix: () => '',
    plugins: () => PLUGINS.map(p => require(`./${p}/index.js`))
};
