'use strict';

class NullEnv {

    namespaces() {
        return [];
    }

    toVars() {
        return {};
    }

    value() {
        return;
    }
}

module.exports = NullEnv;
