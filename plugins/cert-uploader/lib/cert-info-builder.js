
'use strict';

class CertInfoBuilder {

    build(certificate) {
        const certMeta = certificate.ServerCertificateMetadata;
        return {
            [certMeta.ServerCertificateName]: {
                id: certMeta.ServerCertificateId,
                arn: certMeta.Arn
            }
        };
    }

}

module.exports = CertInfoBuilder;
