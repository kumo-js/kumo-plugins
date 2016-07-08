## structure

```bash
— LAMBDA TEMPLATE BUILDER

    inputs -> config, stack output, package-locations
    lambda-definitions.json
           lambdas: {
                webhook-notifier: {
                    resource-attributes: {
                        runtime: ‘nodejs’,
                        handler: ‘index.handler’,
                        description: {$ref: #/_package-locations/webhook-notifier/build-number},
                        s3location: {$ref: #/_package-locations/webhook-notifier/location}
                          role-policy: {},
                           memory: {$ref: #/_config/lambdas/updates/memory},
                           timeout: {$ref: #/_config/lambdas/updates/timeout}
                        env: {
                            abc: {$ref: #/_config/lambdas/updates/memory}
                        }
                    }
                }
           }

            _config,
            _stack
            _package_locations
        }
```