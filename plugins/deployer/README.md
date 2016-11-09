
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

### Settings Schema
   
```js
{
  "moduleName": "",
  "dependsOn": [...],
  "outputsBucket": {},
  "config": {},
  "tasks": [...]
}
```

#### `moduleName`

Name of the module.

#### `outputsBucket`

Configure the S3 bucket used to store the outputs of all deployment [tasks](#tasks). E.g.

```js
{
  "outputsBucket": {
    "name": "deployment-outputs"
  }
}
```

The `name` can also be an array of strings to support dynamic items. In this case,
the different items will be concatenated using the `-` separator. E.g.

```js
{
  "outputsBucket": {
    "name": ["deployment-outputs", {"$ref": "#/_env"}] 
  }
  // will produce 'deployment-outputs-ci' if #/_env is ci
} 
```

The bucket will be created if it doesn't already exist, but will not be 
removed if the module is destroyed.

#### `dependsOn`

A list of modules (in the form of directory paths) of which config and existing that will be traversed to 
collect config and outputs BEFORE starting the deployment process.
E.g. `"dependsOn": ['../moduleA', '../moduleB]` 



#### `tasks`


#### `config`


#### Script section
