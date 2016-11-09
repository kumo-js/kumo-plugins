'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const deRefJson = Promise.promisify(require('json-schema-deref'));

class JsonSchemaHelper {

    deref(schema) {
        return deRefJson(schema);
    }

    derefWith(schema, refData, options) {
        options = Object.assign({refDataPrefix: '_'}, options);
        refData = _.mapKeys(refData || {}, (v, k) => options.refDataPrefix + k);
        const refDataKeys = Object.keys(refData || {});
        return this.deref(Object.assign({}, schema, refData))
            .then(deReferencedSchema => _.omit(deReferencedSchema, refDataKeys));
    }

}

module.exports = JsonSchemaHelper;
