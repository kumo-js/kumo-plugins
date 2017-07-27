'use strict';

class JoinIntrinsicFunction {

    constructor(params) {
        this._items = params.items;
    }

    evaluate() {
        const separator = this._items[0];
        const elements = this._items[1];
        return elements.join(separator);
    }
}

module.exports = JoinIntrinsicFunction;
