'use strict';

const _ = require('lodash');

const SEPARATOR = '--';

class Env {

    constructor(value) {
        this._value = value;
    }

    namespaces() {
        this._namespaces = this._namespaces || this._buildNamespaces();
        return this._namespaces;
    }

    namespaceAtLevel(level) {
        if (level === 'root') return this.root();
        const count = this.namespaces().length - 1;
        return this.namespaces()[count - level];
    }

    root() {
        return this.namespaces()[0];
    }

    toVars() {
        const result = {env: this.value(), envNamespaceRoot: this.root()};
        return Object.assign(result, this.namespaces().reduce(
            (levels, ns, i) => Object.assign(levels, this._createNamespaceLevelVar(i)), {}
        ));
    }

    value() {
        return this._value || '';
    }

    _createNamespaceLevelVar(level) {
        return {[`envNamespaceLevel${level}`]: this.namespaceAtLevel(level)};
    }

    _buildNamespaces() {
        const parts = this.value().split(SEPARATOR);
        return parts.reduce((namespaces, part) => {
            const prevNamespace = _.last(namespaces) || '';
            const separator = prevNamespace !== '' ? SEPARATOR : '';
            return namespaces.concat(prevNamespace + separator + part);
        }, []);
    }
}

module.exports = Env;
