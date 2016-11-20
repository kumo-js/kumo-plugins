# Crypto

The crypto plugin allows encryption and decryption of data from the standard input
stream using built in providers. Currently the only supported provider is aws kms.

## Usage

Each encryption / decryption command takes input data from the standard input stream 
and hence supports piping for maximum flexibility. In addition, each command requires 
[provider](#providers) specific args for encryption / decryption. These can either be 
supplied as command line args or saved to a [settings file](#settings-file) with a 
named profile and referenced via the `--profile` arg. 

E.g. supply provider specifc args individually
```sh
echo "secret" | kumo encrypt --provider kms --keyId .. --region ..
```

Or, create profile in [settings file](#settings-file) and reference via profile
```sh 
echo "secret" | kumo encrypt --profile "my-profile" 
# The profile 'my-profile' must define the provider and any 
# provider specific attributes e.g. in this case keyId and region  
```

Currently all results are printed to the standard output stream and can be piped
to file if required.

### Encryption

* encrypt value  
  `echo "secret" | kumo encrypt --profile kms`
  
* encrypt entire json file  
  `cat config.json | kumo encrypt --profile kms --inputFormat json`

* encrypt a section in a json file  
  `cat config.json | kumo encrypt --profile kms --inputFormat json --keyPath "key.path"`

### Decryption

* decrypt value  
  `echo "encrypted::..." | kumo decrypt --profile kms`

* decrypt entire json file  
  `cat config.json | kumo decrypt --profile kms --inputFormat json`

* decrypt a given section in a json file  
  `cat config.json | kumo decrypt --profile kms --inputFormat json --keyPath "key.path"`

## Argument reference 

```
--profile name
    Optional. The name of the profile (in the settings file) that defines the provider 
    to use to encrypt / decrypt. Any args given at command line will override the
    values in the profile.

--inputFormat (text|json|yaml)
    Optional. The format of the input data. By default it is text.

--outputFormat (text|json|yaml)
    Optional. The output format to use. By default this is the 
    same as --inputFormat.

--keyPath keyPath
    Optional. Specifies the key path (i.e. section) within the input data 
    to encrypt / decrypt. This works if the input data is json or yaml.
    E.g. if the input data contains {"parent": {"child": "abc"}}, you can 
    specify 'parent.child' to encrypt / decrypt 'abc'.

```

## Settings file

Profiles for encryption / decryption can either be stored in the `kumo.json` 
file under the `crypto.profiles` section, or in a separate file named 
`crypto-profiles.(json|yaml|js)` and has the following structure:

```js
{
  "<profile-name>": {
    "provider": "kms",
    ..(provider specific attributes)..
  } 
}
```

See [providers](#providers) for more details.

Note: If storing in a separate `crypto-profiles` file, this must exist in the same 
location as the command being executed.

## Providers

### kms

**via command line args** `--provider kms --keyId --region`

**via settings file**

```js
{
  "provider": "kms", 
  "keyId": "", 
  "region": ""
}
```