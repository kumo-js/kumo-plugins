'use strict';

const _ = require('lodash');

const SECRET_DENOTER = 'secret::';
const FIELD_SEPARATOR = ',';
const KEY_VALUE_SEPARATOR = '::';

class SecretSerializer {

    canDeserialize(str) {
        str = str || '';
        return str.toString().startsWith(SECRET_DENOTER);
    }

    deserialize(str) {
        str = str.substr(SECRET_DENOTER.length);
        const fields = str.split(FIELD_SEPARATOR);
        return _.fromPairs(fields.map(field => field.split(KEY_VALUE_SEPARATOR)));
    }

    serialize(secret) {
        const fields = _.map(secret, (v, k) => k + KEY_VALUE_SEPARATOR + v);
        return SECRET_DENOTER.concat(fields.join(FIELD_SEPARATOR));
    }
}

module.exports = SecretSerializer;