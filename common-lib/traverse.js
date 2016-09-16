const traverse = require('traverse');
const whenTraverse = require('when-traverse');

module.exports = {

    all: (obj, transform) => {
        return whenTraverse(
            traverse(obj).map(function (value) {
                this.update(transform(value));
            })
        );
    },

    values: (obj, transform) => {
        return this.all(obj, value =>
            typeof(value) === 'object' ? value : transform(value)
        );
    }
};
