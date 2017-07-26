'use strict';

class JoinIntrinsicFunction {

    constructor(params) {
        this._items = params.items;
    }

    evaluate() {
        const separator = this._items[0];
        return this._items.slice(1).join(separator);
    }
}

module.exports = JoinIntrinsicFunction;
