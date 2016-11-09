
const DataFormatter = require('../lib/data-formatter');

describe('CommonLib DataFormatter', () => {

    it('format data into JSON', () => {
        const dataFormatter = new DataFormatter();
        const data = {KEY: ['VALUE1', 'VALUE2']};
        return dataFormatter.format(data, 'json').then(result => {
            expect(result).to.eql([
                '{',
                '  "KEY": [',
                '    "VALUE1",',
                '    "VALUE2"',
                '  ]',
                '}'
            ].join('\n'));
        });
    });
});
