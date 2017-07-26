'use strict';

class NullOutputsStore {

    initialise() {
        return Promise.resolve();
    }

    collect() {
        return Promise.resolve({});
    }

    save(_id, _outputs) {
        return Promise.resolve();
    }

    remove(_id) {
        return Promise.resolve();
    }

    removeAllExcept(_ids) {
        return Promise.resolve();
    }
}

module.exports = NullOutputsStore;
