
'use strict';

class CertInfoBuilder {

    build(resourceName, certificate) {
        const certMeta = certificate.ServerCertificateMetadata;
        return {
            [resourceName]: {
                id: certMeta.ServerCertificateId,
                arn: certMeta.Arn,
                name: certMeta.ServerCertificateName
            }
        };
    }

}

module.exports = CertInfoBuilder;
