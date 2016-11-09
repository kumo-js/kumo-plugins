
# Module Deployer

The module deployer plugin is essentially a command line runner that executes a list of tasks in order.
It records the output of each task in an s3 bucket and makes those outputs available to subsequent tasks.
It also supports undoing all tasks in reverse order.

## Usage

Go to any directory containing a `deployment-settings.(yam|json|js)` file and execute one of the following:

* **To Deploy** `kumo deploy-module --region --env`
* **To Destroy** `kumo destroy-module --region --env`

Arguments are as follows:

```
--region region
        Required. The default aws region.

--env environment
        Required. The deployment environment namespace.
        Namespace levels should be specified using the -- separator so they
        can be recognised and parsed by the plugin. E.g. the plugin recognises
        the environment 'pre-prod--dev--john' as having has three levels:

            level0: pre-prod--dev--john
            level1: pre-prod--dev
            level2(i.e. root): pre-prod

        These levels can be individually referenced in scripts via ENV vars.
        See settings file for more details.
```


## `deployment-settings`

The following examples assume a `.json` file but you can also use `.yaml` or `.js`

#### Json Schema References

Json schema references i.e. `{"$ref": ".."}` are supported in the settings file.
There are some built-in references available for use:

```js
// To reference command line args (in cameCase) supplied to the plugin:
{"$ref": "#/_args/.."}

// To reference the full env namespace:
{"$ref": "#/_env"}

// To reference the root env namespace e.g. 'pre-prod' if env is 'pre-prod--ci':
{"$ref": "#/_envNamespaceRoot"}

// To reference a given env namespace level:
{"$ref": "#/_envNamespaceLevel[X]"} // where X is >= 0
```

#### Script Sections

The flexibility of the deployer is achieved through the use of scripts that are executed
at different stages of the deployment process. Scripts allow the consumer to execute any arbitrary
command to achieve the desired outcome. They are used in several places including the [config](#config)
section, [tasks](#tasks) section etc.

All scripts have some built-in env variables available for use, which are equivalent to the built-in [json schema references](#json-schema-references).

```bash
$KUMO_ARGS_[XXX]
$KUMO_ENV
$KUMO_ENV_NAMESPACE_ROOT
$KUMO_ENV_NAMESPACE_LEVEL[X]
```


### Settings Schema

```js
{
  "moduleName": "",
  "outputsBucket": {},
  "dependsOn": [...],
  "config": {},
  "tasks": [...]
}
```

#### `moduleName`

Name of the module.

#### `outputsBucket`

Configure the S3 bucket used to store the outputs of all deployment [tasks](#tasks). E.g.

```js
"outputsBucket": {"name": "deployment-outputs"}
```

The `name` can also be an array of strings to support dynamic items. In this case,
the different items will be concatenated using the `-` separator. E.g.

```js
"outputsBucket": {
  "name": ["deployment-outputs", {"$ref": "#/_env"}]
}
// produces 'deployment-outputs-ci' if #/_env is ci
```

The bucket will be created if it doesn't already exist, but currently will not be
removed if the module is destroyed.

#### `dependsOn`

A list of dependent modules from which to **collect** [config](#config) and any existing
[deployment outputs](#outputsbucket), that will be merged with the current module and made availble for use
during deployment. E.g.

```js
"dependsOn": ["../moduleA", "../moduleB"]
```

Modules are given as directory paths (that must each contain a `deployment-settings` file).
Dependencies are deeply traversed left to right.

The collected config is made available to **[tasks](#tasks)** via:
* `$KUMO_DEPLOYMENT_CONFIG` env variable (in the script section) OR
* `{"$ref": "#/_deploymentConfig/.."}` json schema reference

The collected outputs is made available to **[tasks](#tasks)** via:
* `$KUMO_DEPLOYMENT_OUTPUTS` env variable (in the script section) OR
* `{"$ref": "#/_deploymentOutputs/.."}` json schema reference

#### `config`


#### `tasks`
