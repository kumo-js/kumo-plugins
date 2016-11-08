
'use strict';

class ActionResultBuilder {

    build(uploadCertResult) {
        const certMeta = uploadCertResult.ServerCertificateMetadata;
        return {[certMeta.ServerCertificateName]: certMeta.Arn};
    }

}

module.exports = ActionResultBuilder;
