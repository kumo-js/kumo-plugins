
# Package Uploader

## Usage

Go to a directory where you have `package-settings.json` and execute `upload-package` command.
`package-settings.json` is a file to specify how to create a package and where to upload.

```sh
$ kumo upload-package --build-number 99999 --output OUTPUT --upload-bucket UPLOAD_BUCKET
```

Arguments are as follows:

```
--build-number buildNumber
        Required. Build number

--output output
        Required. Path of an output file. Default to package-locations.json

--upload-bucket UPLOAD_BUCKET
        Required. Name of the bucket to upload package to
```

## Setting file

`package-settings.json` can have following contents:

```js
{
  "packages": [
    {
      "name": "my-package",   // <package-name>

      // $KUMO_PACKAGE_OUTPUT_FILE has the format: <temp-dir-path>/<package-name>-<build-number>.zip
      // packaging-command has to save a zip file to $KUMO_PACKAGE_OUTPUT_FILE
      "package-script": "sample-packaging-command /path/to/package --output $KUMO_PACKAGE_OUTPUT_FILE",
    }
  ]
}
```

By using the json scheme reference, you can access the build number via `#/_buildNumber`.

After the successful execution of the `kumo upload-package` command, you should get a json file containing
the locations of uploaded packages in S3. The path of the json file is what you have specified with `--output` option.

```json
{
  "<package-name>": {
    "s3Bucket": "<upload-bucket>",
    "s3Key": "<package-name>-<build-number>.zip"
  }
}
```
