
'use strict';

class CertInfoBuilder {

    build(certificate) {
        const certMeta = certificate.ServerCertificateMetadata;
        return {
            id: certMeta.ServerCertificateId,
            arn: certMeta.Arn,
            name: certMeta.ServerCertificateName
        };
    }

}

module.exports = CertInfoBuilder;
