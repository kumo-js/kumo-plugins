
# Lambda Package Uploader

## Usage

Go to a directory where you have `lambda-packages.json` and execute `upload-lambda` command.
`lambda-packages.json` is a file to specify how to create a lambda package and where to upload.

```sh
$ kumo upload-lambda --build-number 99999 --env ENV_NAME --config CONFIG --resources RESOURCES --output OUTPUT
```

Arguments are as follows:

```
--build-number buildNumber
        Required. Build number

--env environment
        Required. Environment name (id?)

--config config
        Optional. JSON string, containing environment specific config values

--resources resources
        Optional. Path to a JSON file that contains resources

--output output
        Required. Path of an output file. Default to package-locations.json
```

**TODO: Change `--config` to accept a file path to load a config from, instead of a string**

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
      "name": "my-lambda-function",   // <lambda-name>

      // $KUMO_PACKAGE_OUTPUT_FILE has the format: <temp-dir-path>/<env>-<lambda-name>-<build-number>.zip
      // packaging-command has to save a zipped lambda as $KUMO_PACKAGE_OUTPUT_FILE
      "package-script": "sample-packaging-command /path/to/lambda --output $KUMO_PACKAGE_OUTPUT_FILE",
    }
  ]
}
```

By using the json scheme reference, you can access the values given as the command line arguments.
They are accessible via `#/_env`, `#/_buildNumber`, `#/_config`, `#/_resources`.

After the successful execution of the `kumo upload-lambda` command, you should get a json file containing
the locations of uploaded lambdas. The path of the json file is what you have specified with `--output` option.

```json
{
  "<lambda-name>": "s3://kumo-bucket/packages/<env>-<lambda-name>-<build-number>.zip"
}
```
