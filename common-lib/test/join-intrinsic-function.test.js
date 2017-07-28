
const JoinIntrinsicFunction = require('../lib/join-intrinsic-function');

describe('CommonLib JoinIntrinsicFunction', () => {

    it('joins elements with delimiter', () => {
        const delimiter = '-';
        const elements = ['A', 'B', 'C'];
        const fn = new JoinIntrinsicFunction({
            items: [delimiter, elements]
        });
        expect(fn.evaluate()).to.eql('A-B-C');
    });

});
