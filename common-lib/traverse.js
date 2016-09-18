'use strict';

const traverse = require('traverse');
const whenTraverse = require('when-traverse');

class Traverse {

    all(obj, transform) {
        return whenTraverse(
            traverse(obj).map(function (value) {
                this.update(transform(value));
            })
        );
    }

    values(obj, transform) {
        return this.all(obj, value =>
            typeof(value) === 'object' ? value : transform(value)
        );
    }
}

module.exports = new Traverse();