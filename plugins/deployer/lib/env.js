'use strict';

const SEPARATOR = '--';

class Env {

    constructor(value) {
        this._value = value || this._default();
    }

    value() {
        return this._value;
    }

    prefix() {
        const parts = (this.value() || '').split(SEPARATOR);
        return parts.length > 1 ? parts[0] : undefined;
    }

    _default() {
        const user = process.env['USER'].replace(/\./, '-');
        return `dev-${user}`;
    }
}

module.exports = Env;
