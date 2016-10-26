'use strict';

const _ = require('lodash');

const SEPARATOR = '--';

class Env {

    constructor(value) {
        this._value = value;
    }

    paths() {
        return this._paths = this._paths || this._buildPaths();
    }

    root() {
        return this.paths()[0];
    }

    value() {
        return this._value || '';
    }

    toVars() {
        return {
            env: this.value(),
            envRoot: this.root()
        }
    }

    _buildPaths() {
        const items = this.value().split(SEPARATOR);
        return items.reduce((paths, item) => {
            const prevPath = _.last(paths);
            const prefix = prevPath ? prevPath + SEPARATOR : '';
            return paths.concat(prefix.concat(item));
        }, []);
    }
}

module.exports = Env;
