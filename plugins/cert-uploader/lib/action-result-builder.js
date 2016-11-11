
'use strict';

class ActionResultBuilder {

    build(uploadCertResult) {
        const certMeta = uploadCertResult.ServerCertificateMetadata;
        return {
            [certMeta.ServerCertificateName]: {
                id: certMeta.ServerCertificateId,
                arn: certMeta.Arn
            }
        };
    }

}

module.exports = ActionResultBuilder;
