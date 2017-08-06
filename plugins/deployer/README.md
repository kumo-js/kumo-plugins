
# Module Deployer

The module deployer plugin is essentially a command line runner that executes a list of tasks in order.
It keeps track of the outputs of each task, makes those outputs available to subsequent tasks and can 
optionally store them in an output store. It also supports undoing all tasks in reverse order.

## Usage

Go to any directory containing a `deployment-settings.(yam|json|js)` file and execute one of the following:

* **To Deploy** `kumo deploy-module --region --env`
* **To Destroy** `kumo destroy-module --region --env`

Arguments are as follows:

```
--region region
        Required. The default aws region.

--env environment
        Optional. The deployment environment namespace.
        Namespace levels should be specified using the -- separator so they
        can be recognised and parsed by the plugin. E.g. the plugin recognises
        the environment 'pre-prod--dev--john' as having has three levels:

            level0: pre-prod--dev--john
            level1: pre-prod--dev
            level2(i.e. root): pre-prod

        These levels can be individually referenced in the deployment-settings file
        via json schema references.
```

## `deployment-settings` file

The following examples assume a `.json` file but you can also use `.yaml` or `.js`

### Json Schema References

Json schema references i.e. `{"$ref": ".."}` are supported in the settings file.

#### Built-in Json Schema Reference Variables (available globally)

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

### Intrinsic Functions

Intrintic functions are also supported throughout the settings file and can be used in 
scenarios where you need to define more complex values. 

#### `Fn:Join`

Used to concatenate values using the given separator e.g.

```js
{
  "Fn::Join": [
    "-", 
    [
      {"$ref": "#/env"},
      "bucket"
    ]
  ]
}

// produces 'test-bucket' if #/env evaluates to 'test'
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

### High level Settings Schema

```js
{
  "moduleName": "",
  "config": {},
  "outputsStore": {},
  "dataSources": {},
  "tasks": [...]
}
```

#### Execution Order

The deployer executes by processing settings in the following order: [`config`](#config), 
[`outputsStore`](#outputsstore), [`dataSources`](#datasources), [`tasks`](#tasks). Some sections generate 
outputs that are made available to subsequent sections via json schema references. Details of these 
can be found in each section.


### `moduleName`

Required. Name of the module.

### `config`

Optional. A [script](#script-sections) for obtaining any custom config for the deployment. 
The script must output the config as a JSON string to standard out. The loaded config is then made 
available via the `#/_deploymentConfig/..` json schema ref. 

### `outputsStore`

Optional. Destinaton used to store the outputs of all deployment [tasks](#tasks). Different store 
types are supported.  


You can also define an `outputsStore` section in your `kumo.json` file e.g.

```js
"deployer": {
  "outputsStore": {}
}

// The 'outputsStore' section in your 'deployment-settings' file will be merged 
// with that in 'kumo.json' and is useful in scenarios where you wish to define 
// outputs store once for multiple modules.
```

More importantly, if you specify an outputs store then after the initial deployment of your module, 
all subsequent deployments will have access to the outputs via the `#/_deploymentOutputs/..` json schema ref.

#### S3 outputs store

```js
// example

"outputsStore": {
  "type": "s3-bucket",
  "region": "ap-southeast-2",
  "bucket": "my-outputs-bucket",
  "prefix": {"Fn::Join": ["/", {"$ref": "#/_args/env"}, {"$ref": "#/moduleName"}]}
}
```

The bucket will be created if it does not exist, but will not be destroyed if the module is destroyed.

### `dataSources`

Optional. A hash of data sources from which to fetch data that is required for the deployment of the 
current module. This is useful in scenarios where you want to grab the outputs / names of resources deployed 
by another module. Different data sources are supported and all data must be json compatible. 

```js
"dataSources": {
  "moduleAOutputs": {...},
  "moduleBOutputs": {...}
}
```

The fetched data is made available to settings via the `#/_dataSources/<name>/..` json schema ref.

#### S3 Data Source

```js
// example

"dataSources": {
  "moduleAOutputs": {
    "type": "s3-bucket",
    "region": "ap-southeast-2",
    "bucket": "outputs-bucket",
    "key": {"Fn::Join": ["/", {"$ref": "#/_args/env"}, "moduleA"]}
  }
}
```

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
  },
  // Optional region overrides for this task. If provided overrides
  // the given command line region arg with the override region during
  // task execution.

  "outputsName": ""
  // Optional, the name under which all task outputs are grouped.
}
```

The final evaluated region for each task is accessible via the special `#/_taskRegion` json schema ref,
which into account any `regionOverrides` for the task.

In addition, as mentioned previously, each task can reference deployment [config](#config), [outputs](#outputsstore) 
and [data sources](#datasources) via json schema refs.


#### Task Outputs

Each task can output variables in json compatible format. After each task executes, its outputs (if any)
are uploaded to the [`outputsStore`](#outputsstore) (if provided), then merged with the overall deployment 
outputs and made available to subsequent tasks via the `#/_deploymentOutputs/..` json schema ref.

E.g. assuming we are deploying a module, the following visualises the state of deployment outputs 
through the deployment process:

  ```js
  // Before any tasks are executed, deployment outputs contains any exisiting outputs
  // for the current module, fetched from the outputsStore. Initially this is empty:
  {}

  // Assuming module1 consists of two tasks, when the first task executes it
  // has access to the current outputs. On completion, it outputs {"abc": 123} which
  // is merged with all deployment outputs:
  {
    "abc": 123
  }

  // When the second task executes, it has access to the current outputs
  // (including those from the first task). On completion, it outputs {"def": 456}
  // which is again merged with all deployment outputs:
  {
    "abc": 123,
    "def": 456
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
Required. The name of the cloud formation stack.

#### `stackTemplate`
Required. A [script](#script-sections) that generates the json compatible template used to
create the stack. Your script must generate/copy the template to a special location that is 
accessible via the `#/_templateOutputFile` json schema ref.

```js
{
  ...

  "stackTemplate": {
    "script": "cp template.json $TEMPLATE_OUTPUT_FILE",
    "envVars": {
      "TEMPLATE_OUTPUT_FILE": {"$ref": "#/_templateOutputFile"}
    }
  }
}
```

#### `stackParams`
Optional. If the template contains parameters, you can specify the key/value pairs here.
Remember you can take full advantage of json schema references to extract values from deployment config, 
deployment outputs and data sources.

```js
// example template.json

"Parameters": {
  "DomainName": {..},
  "IamCertificateId": {..}
}
...
```

```js
// example cf-stack task attributes
{
  ...
  "stackParams": {
    "DomainName": {"$ref": "#/_deploymentConfig/domainName"},
    "IamCertificateId": {"$ref": "#/_deploymentOutputs/iamCertificateId"}
  }
}
```

#### Task Outputs

Upon completion of this task the outputs of the stack are automatically extracted
and merged with the deployment outputs .

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
of this task that are required by subsequent tasks must be saved to a special location
that is accessible via the `#/_taskOutputsFile` json schema ref.

```js
{
  "run": {
    "script": "(do stuff...) > $TASK_OUTPUTS_FILE",
    "envVars": {
      "TASK_OUTPUTS_FILE": {"$ref": "#/_taskOutputsFile"}
    }
  }
}
```

Note: outputs must be json compatible (i.e. json or yaml).

#### `undo`

Optional. The undo [script](#script-sections) which **must be idempotent**.
