
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

    it('format data into YAML', () => {
        const dataFormatter = new DataFormatter();
        const data = {KEY: ['VALUE1', 'VALUE2']};
        return dataFormatter.format(data, 'yaml').then(result => {
            expect(result).to.eql([
                'KEY:',
                '  - VALUE1',
                '  - VALUE2',
                ''
            ].join('\n'));
        });
    });

    it('throws an error if unknown output format is specified', () => {
        const dataFormatter = new DataFormatter();
        const data = {KEY: ['VALUE1', 'VALUE2']};
        const fn = () => {
            dataFormatter.format(data, 'UNKNOWN_FILE_FORMAT');
        };
        expect(fn).to.throws('UNKNOWN_FILE_FORMAT output format not supported.');
    });

});
