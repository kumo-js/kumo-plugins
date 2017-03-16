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

    toVars() {
        const namespaces = this.namespaces();
        const result = {env: this.value(), envNamespaceRoot: namespaces[0]};
        return Object.assign(result, namespaces.reduce(
            (levels, ns, i) => Object.assign(levels, this._createNamespaceLevelVar(i)), {}
        ));
    }

    value() {
        return this._value;
    }

    _createNamespaceLevelVar(level) {
        return {[`envNamespaceLevel${level}`]: this._namespaceAtLevel(level)};
    }

    _namespaceAtLevel(level) {
        const count = this.namespaces().length - 1;
        return this.namespaces()[count - level];
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
