
# Lambda Package Uploader

## Usage

Go to a directory where you have `lambda-packages.json` and execute `upload-lambda` command.
`lambda-packages.json` is a file to specify how to create a lambda package and where to upload.

```sh
$ kumo upload-lambda --build-number 99999 --output OUTPUT --upload-bucket UPLOAD_BUCKET
```

Arguments are as follows:

```
--build-number buildNumber
        Required. Build number

--output output
        Required. Path of an output file. Default to package-locations.json

--upload-bucket UPLOAD_BUCKET
        Required. Name of the bucket to upload lambda to
```

## Setting file

`lambda-packages.json` can have following contents:

```js
{
  "packages": [
    {
      "name": "my-lambda-function",   // <lambda-name>

      // $KUMO_PACKAGE_OUTPUT_FILE has the format: <temp-dir-path>/<lambda-name>-<build-number>.zip
      // packaging-command has to save a zipped lambda as $KUMO_PACKAGE_OUTPUT_FILE
      "package-script": "sample-packaging-command /path/to/lambda --output $KUMO_PACKAGE_OUTPUT_FILE",
    }
  ]
}
```

By using the json scheme reference, you can access the build number via `#/_buildNumber`.

After the successful execution of the `kumo upload-lambda` command, you should get a json file containing
the locations of uploaded lambdas in S3. The path of the json file is what you have specified with `--output` option.

```json
{
  "<lambda-name>": {
    "s3Bucket": "<upload-bucket>",
    "s3Key": "<lambda-name>-<build-number>.zip"
  }
}
```
