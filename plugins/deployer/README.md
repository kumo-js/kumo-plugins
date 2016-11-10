
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
         
        These levels can be individually referenced in the deployment-settings file
        via ENV vars or json schema references.
```

## `deployment-settings` file

The following examples assume a `.json` file but you can also use `.yaml` or `.js`

### Json Schema References

Json schema references i.e. `{"$ref": ".."}` are supported in the settings file.

#### Built-in Json Schema Reference Variables

```js
{"$ref": "#/_args/.."} 
// References command line args (in cameCase) supplied to the plugin

{"$ref": "#/_env"}
// References the full env namespace

{"$ref": "#/_envNamespaceRoot"}
// References the root env namespace e.g. 'pre-prod' if env is 'pre-prod--ci'
 
{"$ref": "#/_envNamespaceLevel<X>"}
// References a given env namespace level where <X> is >= 0
```

### Script Sections

The flexibility of the deployer is achieved through the use of scripts that are executed
at different stages of the deployment process. Scripts allow the consumer to execute any arbitrary
command to achieve the desired outcome. They are used in several places including sections such as 
[`config`](#config), [`tasks`](#tasks) etc, and have the following structure:

```js
{
  "script": "some-script $SOME_ENV_VAR",
  "envVars": {"SOME_ENV_VAR", "foo bar"} // custom env vars for your script (optional) 
}
```

#### Built-in `script` ENV variables

These are similar to the [built-in json schema reference variables](#built-in-json-schema-references).

```
$KUMO_ENV
$KUMO_ENV_NAMESPACE_ROOT
$KUMO_ENV_NAMESPACE_LEVEL<X>  // where <X> is >= 0
$KUMO_ARGS_<XXX>              // where <XXX> is the arg name
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

### `moduleName`

Required. Name of the module.

### `outputsBucket`

Required. The S3 bucket used to store the outputs of all deployment [tasks](#tasks). E.g.

```js
"outputsBucket": {"name": "deployment-outputs"}
```

The `name` can also be an array of strings to support dynamic items. In this case,
the different items will be concatenated using the `-` separator. E.g.

```js
"outputsBucket": {
  "name": ["deployment-outputs", {"$ref": "#/_env"}] 
}
// produces 'deployment-outputs-ci' if '#/_env' is ci 
```

The bucket will be created if it doesn't already exist, but currently will not be 
removed if the module is destroyed. 

You can also define common `outputBucket` settings in your `kumo.json` file e.g.

```js
"deployer": {
  "outputsBucket": {"name": ...}
}
``` 

The `deployment-settings` file will be merged with the above settings and is useful
in scenarios where you wish to define outputs bucket once for multiple modules. 

### `dependsOn`

Optional. A list of dependent modules from which to collect [config](#config) and any existing 
[deployment outputs](#outputsbucket). These will be merged with those of the current module 
and made available as [task variables](#task-variables) for use during deployment. E.g. 

```js
"dependsOn": ["../moduleA", "../moduleB"]
```

Modules are given as directory paths (that must each contain a `deployment-settings` file).
Dependencies are deeply traversed left to right.

### `config`

// TODO

### `tasks`

Defines a list of operations to perform during deployment. Tasks are executed sequentially
during deployment, and in reverse order during teardown. Each task (irrespective of `type`)
has the following common attributes:

```js
{
  "id": "", 
  // Unique id for the task in this module. Required.

  "type": "custom|cf-task", 
  // The type of task. Required, defaults to custom.

  "regionOverrides": {
    "region-arg": "region-override"
  }
  // Optional region overrides for this task. If provided overrides 
  // the given command line region arg with the override region during
  // task execution.    
}
```

#### Task Variables

All tasks have access to the following variables either via ENV variables 
(in [script sections](#script-sections)) or via json schema references:

* **Task region**  
  The resolved task region (taking into account any region overrides)  
  - ENV variable: `$KUMO_TASK_REGION`
  - Json schema ref: `{"$ref": "#/_taskRegion"}` 

* **Deployment Config**  
  The collected deployment config for the module (including [dependant modules](#dependson))  
  - ENV variable: `$KUMO_DEPLOYMENT_CONFIG` (value is JSON string)
  - Json schema ref: `{"$ref": "#/_deploymentConfig/.."}`   

* **Deployment Outputs**  
  The collected deployment outputs for the module (including [dependant modules](#dependson))
  - ENV variable: `$KUMO_DEPLOYMENT_OUTPUTS` (value is JSON string)
  - Json schema ref: `{"$ref": "#/_deploymentOutputs/.."}`

### `tasks type:cf-stack`

