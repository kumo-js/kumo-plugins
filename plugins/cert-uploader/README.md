
# Certificate Uploader

Certificate Uploader uploads a given SSL certificate. If there is already a certificate
whose name is same with the given name, the command returns the information of the
certificate instead of uploading new one.

## Usage

```sh
$ kumo upload-cert --name CERT_NAME --path PATH --body=BODY --private-key=PRIVATE_KEY --chain=CHAIN
```

Note that you would need to join the option name and value with `=` for `body`, `private-key` and `chain`.
Also as certs are multiline texts, you would need to quote them.

Arguments are as follows:

```
--name CERT_NAME
        Name of certificate

--path PATH
        The path for the server certificate

--body BODY
        The contents of the public key certificate in PEM-encoded format

--private-key PRIVATE_KEY
        The contents of the private key in PEM-encoded format

--chain CHAIN
        The contents of the certificate chain
```

The output of the command:

```json
{
  "CERT_NAME": {
    "id": "CERTIFICATE_ID",
    "arn": "CERTIFICATE_ARN",
    "name": "CERT_NAME"
  }
}
```
