'use strict';

const PLUGINS = [
    'app-deployer',
    'secrets-manager'
];

module.exports = {

    prefix: () => '',
    plugins: () => PLUGINS.map(p => require(`./${p}/index.js`))
};
