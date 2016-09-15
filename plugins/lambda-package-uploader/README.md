
# lambda-package-uploader

## Usage

Go to a directory where you have `lambda-packages.json` and execute `upload-lambda` command.
`lambda-packages.json` is a file to specify how to create a lambda package and where to upload.

```sh
$ kumo upload-lambda --build_number 99999 --env ENV_NAME --config CONFIG --resources RESOURCES --output OUTPUT
```

Arguments are as follows:

```
--build_number build_number
        Build number

--env environment
        Environment name (id?)

--config config
        JSON string, containing environment specific config values

--resources resources
        Path to a JSON file that contains resources

--output output
        Path of an output file. Default to package-locations.json
```

MEMO: `config` contents will be merged with settings


## Setting file

`lambda-packages.json` can have following contents:

```js
{
  "uploadBucket": {
    "name": {
      "$ref": "#/_resources/packages-bucket"
    },
    "prefix": {
      "$ref": "#/_env"
    }
  },
  "packages": [
    {
      "name": "my-lambda-function",   // <package-name>

      // $PACKAGE_OUTPUT_FILE has the format: <dir-path>/<env>-<package-name>-<build-number>.zip
      // packaging-command has to save a zipped lambda as $PACKAGE_OUTPUT_FILE
      "package-script": "sample-packaging-command /path/to/lambda --output $PACKAGE_OUTPUT_FILE",

      // The value of `envFile` will be written into env.json and injected into the root level
      // of the zipped lambda. This will be performed in-memory and won't be written into a file
      "envFile": {
        "abc": {
          "$ref": "#/_config/lambdas/updates/memory"
        }
      }
    }
  ]
}
```

By using the json scheme reference, you can access the values given as the command line arguments.
They are accessible via `#/_env`, `#/build_number`, `#/_config`, `#/_resources`.

After the successful execution of the `kumo upload-lambda` command, you should get a json file containing
the locations of uploaded lambdas. The path of the json file is what you have specified with `--output-file` option.

```json
{
  "<package-name>": "s3://kumo-bucket/packages/<env>-<package-name>-<build-number>.zip"
}
```
