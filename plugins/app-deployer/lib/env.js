'use strict';

const SEPARATOR = '--';

class Env {

    constructor(value) {
        this._value = value;
    }

    value() {
        return this._value;
    }

    prefix() {
        const parts = (this.value() || '').split(SEPARATOR);
        return parts.length > 1 ? parts[0] : undefined;
    }
}

module.exports = Env;
