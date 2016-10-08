'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const deRefJson = Promise.promisify(require('json-schema-deref'));

class JsonSchemaHelper {

    deref(obj) {
        return deRefJson(obj);
    }

    derefWith(schema, obj) {
        const temporaryProps = Object.keys(obj);
        return this.deref(Object.assign({}, schema, obj))
            .then(derefedSchema => _.omit(derefedSchema, temporaryProps));
    }

}

module.exports = JsonSchemaHelper;
