### OUTDATED! New docs coming soon....

# Secret Keeper

The secret keeper plugin allows encryption and decryption of values and/or files using
built in providers. Currently the only supported provider is aws kms.

## Usage

// TODO: Refactor to accept all input from standard in.

Each command requires [provider](#providers) specific args for encryption / decryption. These can 
either be supplied as command line args or saved to a [settings file](#settings-file)
with a named profile and referenced via the `--profile` arg. 

E.g. supply provider specifc args individually
```sh
kumo encrypt --value "secret" --provider kms --keyId .. --region ..
```

Or, create profile in [settings file](#settings-file) and reference via profile
```sh 
kumo encrypt --value "secret" --profile "my-profile" 
# The profile 'my-profile' must define the provider and any 
# specific attributes e.g. keyId, region etc  
```

All results are always printed to standard out.

### Encryption

* encrypt value  
  `kumo encrypt --value "plain text" --profile kms`
  

* encrypt json compatible file  
  `kumo encrypt --file values.json --profile kms`

* encrypt and store value in json compatible file  
  `kumo securely-store --value "plain text" --file secrets.json --item "key.path" --profile kms`


### Decryption

* decrypt value  
  `kumo decrypt --value "secret::.." --profile kms`

* decrypt json compatible file  
  `kumo decrypt --file secrets.json --profile kms`

* decrypt item in json compatible file  
  `kumo decrypt --file secrets.json --item "key.path" --profile kms`

## Argument reference 

```
--value value
    The value to encrypt / decrypt.

--file path
    Path to the file to encrypt / decrypt. This can be any json compatible 
    file (.js, .json, .yaml). For .js a plain object must be exported and 
    you must also specify --outputFormat.

--item keyPath
    Used in conjunction with the --file arg. Specifies the key path within 
    the file to encrypt / decrypt. E.g. if the file contains 
    {"parent": {"child": "abc"}}, you can specify 'parent.child' for --item.

--profile name
    The name of the profile (in the settings file) that defines the provider 
    to use to encrypt / decrypt.

--outputFormat (json|yaml)
    The output format to use. Not strictly required unless the given --file 
    ends with *.js (as the plugin cannot determine the output format).  

```

## Settings file

Profiles for encryption / decryption can be stored in a file named 
`secret-profiles.(json|yaml|js)`. For now, this must exist in the same 
location as the command being executed and has the following structure:

```js
{
  "<profile-name>": {
    "provider": "kms",
    ..(provider specific attributes)..
  } 
}
```

See [providers](#providers) for more details:

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