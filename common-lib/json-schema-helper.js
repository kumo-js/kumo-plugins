'use strict';

var Promise = require('bluebird');
var deRefJson = Promise.promisify(require('json-schema-deref'));

class JsonSchemaHelper {

    deref(obj) {
        return deRefJson(obj);
    }
}

module.exports = JsonSchemaHelper;
