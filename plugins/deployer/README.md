
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
// References command line args supplied to the plugin

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
  "script": "shell-script $SOME_ENV_VAR",
  "envVars": {"SOME_ENV_VAR", "foo bar"} // custom env vars for your script (optional) 
}
```

#### Built-in `script` ENV variables

These are similar to the [built-in json schema reference variables](#built-in-json-schema-references).

```
$KUMO_ENV
$KUMO_ENV_NAMESPACE_ROOT
$KUMO_ENV_NAMESPACE_LEVEL<X>  // where <X> is >= 0
$KUMO_ARG_<XXX>  // where <XXX> is the arg name
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

Optional. A [script](#script-sections) for obtaining the environment specific configuration for the
deployment which will be made available as [task variables](#task-variables). The script must 
output the config as a JSON string to standard out. 

### `tasks`

Required. Defines a list of operations to perform during deployment. Tasks are executed sequentially
during deployment, and in reverse order during teardown. Each task (irrespective of `type`)
has the following common attributes:

```js
{
  "id": "", 
  // Required. Unique id for the task in this module.

  "type": "custom|cf-task", 
  // Required. The type of task, defaults to custom.

  "regionOverrides": {
    "<region-arg>": "<region-override>"
  }
  // Optional region overrides for this task. If provided overrides 
  // the given command line region arg with the override region during
  // task execution.    
}
```

#### Task Variables

All tasks have access to the following variables either via ENV variables 
(in [script sections](#script-sections)) or via json schema references:

* #### Task region

  The resolved task region (taking into account any region overrides)  
  - ENV variable: `$KUMO_TASK_REGION`
  - Json schema ref: `{"$ref": "#/_taskRegion"}` 

* #### Deployment Config

  The merged deployment config of the module and any [dependant modules](#dependson)  
  - ENV variable: `$KUMO_DEPLOYMENT_CONFIG` (value is JSON string)
  - Json schema ref: `{"$ref": "#/_deploymentConfig/.."}`   

* #### Deployment Outputs

  The merged [task outputs](#task-outputs) of the module and any [dependant modules](#dependson).
  Outputs are grouped by module name.

  - ENV variable: `$KUMO_DEPLOYMENT_OUTPUTS` (value is JSON string)
  - Json schema ref: `{"$ref": "#/_deploymentOutputs/<moduleName>/.."}`

#### Task Outputs

Each task can output variables in json compatible format. After each task executes, its outputs (if any) 
are uploaded to the [outputsBucket](#outputsbucket), then merged with the overall deployment outputs and 
made available to subsequent tasks. 

E.g. assuming we are deploying a module called `module2` which is dependent on `module1`, 
the following visualises the state of deployment outputs through the deployment process:

  ```js
  // Before any tasks are executed, deployment outputs contains any exisiting outputs 
  // for the current module and any dependent modules, fetched from the outputsBucket:
  {
    "module1": {..}
  }

  // Assuming module2 consists of two tasks, when the first task executes it 
  // has access to the current outputs. On completion, it outputs {"abc": 123} which 
  // is merged with all outputs:
  {
    "module1": {..},
    "module2": {
      "abc": 123
    }
  }

  // When the second task executes, it has access to the current outputs 
  // (including those from the first task). On completion, it outputs {"def": 456} 
  // which is again merged with all outputs: 
  {
    "module1": {..},
    "module2": {
      "abc": 123,
      "def": 456
    }
  }
  ```

Please refer to details of each task type below to know how it produces its outputs.

### `tasks type: cf-stack`

This type of task is used to provision a cloud formation stack and has the following 
additional attributes:

```js
{
  "stackName": "",
  "stackTemplate": {..},
  "stackParams": {
    "<name>": "<value>"
  }
}
```

#### `stackName`  
Required. The `stackName` is used in conjunction with the `moduleName` and the `--env` arg 
to generate the full expanded name for the stack. E.g. assuming the following:

```
stackName: "buckets"
moduleName: "module1"
--env pre-prod--ci
```   

The expanded stack name would be `pre-prod--ci-module1-buckets` (using `-` as the separator)

#### `stackTemplate`
Required. A [script](#script-sections) that generates the json compatible template used to 
create the stack. Your script must generate/copy the template to the location specified by
the `$KUMO_TEMPLATE_OUTPUT_FILE` env variable.

#### `stackParams`
Optional. If the template contains parameters, you can specify the key/value pairs here. 
Remember you can take full advantage of json schema references to extract values from 
deployment config and outputs if you wish e.g.

```js
// template contents

"Parameters": {
  "DomainName": {..},
  "IamCertificateId": {..}
}
...
```

```js
// task attributes
{
  ...
  "stackParams": {
    "DomainName": {"$ref": "#/_deploymentConfig/domainName"},
    "IamCertificateId": {"$ref": "#/_deploymentOutputs/module1/iamCertificateId"}
  }
} 
```

#### Task Outputs

Upon completion of this task the outputs of the stack are automatically extracted 
and merged with the deployment outputs.

### `tasks type: custom`

This type of task is used to execute any custom script and has the following 
additional attributes:

```js
{
  "run": {..},
  "undo": {..}
}
```

#### `run`

Required. The [script](#script-sections) to run which **must be idempotent**. Any outputs 
of this task that are required by the deployment process must be saved to the
the location specified by the `$KUMO_TASK_OUTPUTS_FILE` env variable. Outputs must be 
json compatible (i.e. json or yaml). 

#### `undo`

Optional. The undo [script](#script-sections) which **must be idempotent**.
