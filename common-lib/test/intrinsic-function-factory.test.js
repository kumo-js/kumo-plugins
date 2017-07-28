
const IntrinsicFunctionFactory = require('../lib/intrinsic-function-factory');
const JoinIntrinsicFunction = require('../lib/join-intrinsic-function');

describe('CommonLib IntrinsicFunctionSelector', () => {

    it('returns a corresponding intrinsic function', () => {
        const intrinsicFunctionFactory = new IntrinsicFunctionFactory();
        const fn = intrinsicFunctionFactory.create({'Fn::Join': 'ARGUMENTS'});
        expect(fn).to.be.instanceof(JoinIntrinsicFunction);
        expect(fn).to.have.property('evaluate');
    });

    it('returns a function that returns a given value if the value is not an intrinsic function', () => {
        const intrinsicFunctionFactory = new IntrinsicFunctionFactory();
        const fn = intrinsicFunctionFactory.create('NOT_INTRINSIC_FUNCTION');
        expect(fn.evaluate()).to.eql('NOT_INTRINSIC_FUNCTION');
    });

    it('throws an error if the specified intrinsic function is not defined', () => {
        const intrinsicFunctionFactory = new IntrinsicFunctionFactory();
        expect(() => {
            intrinsicFunctionFactory.create({'Fn::NonExisting': 'ARGUMENTS'});
        }).to.throw('Unsupported function Fn::NonExisting');
    });

});
