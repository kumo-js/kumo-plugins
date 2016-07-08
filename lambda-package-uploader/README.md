## Structure

```bash
options:

	temp_package_dir
	build_number || 0.0.0.0

	cwd

	config_file: (optional)
	stack_inputs_file: (optional)
	temp_package_dir: (optional) || defaults to /tmp
	output-file:  (required)


	$PACKAGE_FILE:
	/abc/webhook-notifier-1.2.3.4.zip



	package-upload: {
		bucket: {$ref:#/_stack/….}
		folder: {$ref:#/_config/env}
	}

         packages: [
            {
                name: ‘webhook-notifier’
		package-cmd: ‘npm run package-nodejs-lambda ./lambda -o $PACKAGE_FILE’
                lambdas: {
                    webhook-notifier: {
                        resource-attributes: {
                           runtime: ‘nodes’,
			   role: {$ref:….}
                           handler: ‘index.handler’,
                           memory: {$ref: #/_config/lambdas/updates/memory},
                           timeout: {$ref: #/_config/lambdas/updates/timeout},
                        }
			role: {
				name:
				policies: {}
			}
                }

                }
            }
           ]
```

```bash
—— LAMBDA PACKAGE UPLOADER

    inputs -> config, stack outputs, env, build_number
    lambda-packages.json
       {
           packages: [
            {
                name: ‘webhook-notifier’,
                package-cmd: ‘npm run package-nodejs-lambda ./lambda -o $PACKAGE_FILE’
                env: {
                    abc: {$ref: #/_config/lambdas/updates/memory}
                }
            }
           ]
        }

    outputs -> package-locations.json
    {
        “webhook-notifier”: {
            build-number: 0.0.0.0,
            location: ‘s3://kumo-bucket/packages/webhook-notifer-<env>-<build-number>.zip’
        }
    }
```