
const Settings = require('../../lib/settings');

describe('LambdaPackageUploader Settings', () => {

    it('returns packaging configs', () => {
        const settings = new Settings({
            moduleSettings: {packages: 'PACKAGES'}
        });
        expect(settings.packages).to.eql('PACKAGES');
    });

    it('returns args', () => {
        const settings = new Settings({args: 'ARGS'});
        expect(settings.args).to.eql('ARGS');
    });

    it('returns uploadBucket', () => {
        const settings = new Settings({
            args: {region: 'REGION'},
            moduleSettings: {uploadBucket: {BUCKET: '..'}}
        });
        expect(settings.uploadBucket).to.eql({
            region: 'REGION',
            BUCKET: '..'
        });
    });

});
