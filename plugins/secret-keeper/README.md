
# Secret Keeper

#### Encrypt/decrypt an entire file

```sh
$ kumo encrypt --file unencrypted.json > encrypted.json
$ kumo decrypt --file encrypted.json > unencrypted.json
```

#### Encrypt/decrypt a string

```sh
$ kumo encrypt --value 'my-secret'
$ kumo decrypt --value 'encrypted-value'
```

#### Encrypt and store a string in the given file at the key path location

```sh
$ kumo securely-store --item 'foo.bar' --value 'my-secret' --file file.json
$ cat file.json
{
  "foo": {
    "bar": "encrypted-my-secret"
  },
  "something": ".."
}
```

TODO: Revise the attribute name `--item`
