'use strict';

const _ = require('lodash');

const ENCRYPTED_VALUE_DENOTER = 'encrypted::';
const FIELD_SEPARATOR = ',';
const KEY_VALUE_SEPARATOR = '::';

class EncryptedValueSerializer {

    canDeserialize(str) {
        str = str || '';
        return str.toString().startsWith(ENCRYPTED_VALUE_DENOTER);
    }

    deserialize(str) {
        str = str.substr(ENCRYPTED_VALUE_DENOTER.length);
        const fields = str.split(FIELD_SEPARATOR);
        const data = _.fromPairs(fields.map(field => field.split(KEY_VALUE_SEPARATOR)));
        return {value: data.value, metadata: _.omit(data, 'value')};
    }

    serialize(value, metadata) {
        const data = Object.assign({value}, metadata);
        const fields = _.map(data, (v, k) => k + KEY_VALUE_SEPARATOR + v);
        return ENCRYPTED_VALUE_DENOTER.concat(fields.join(FIELD_SEPARATOR));
    }
}

module.exports = EncryptedValueSerializer;
