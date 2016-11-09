
# Module Deployer

The module deployer plugin is essentially a command line runner that executes a list of tasks in order. 
It records the output of each task in an s3 bucket and makes those outputs available to subsequent tasks.
It also supports undoing all tasks in reverse order. 

## Usage

Go to any directory containing a `deployment-settings.(yam|json|js)` file and execute one of the following:
  
**To Deploy** `kumo deploy-module --region --env`
**To Destroy** `kumo destroy-module --region --env`

Arguments are as follows:

```
--region region
        The default aws region

--env environment
        The deployment environment namespace.
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

## Json Schema References
Json schema references (i.e. `{"$ref": ".."}`) are fully supported.
There are some built-in references available for use:


```json
{"$ref": "#/_args"}
{"$ref": "#/_env"}
{"$ref": "#/_envNamespaceRoot"}
{"$ref": "#/_envNamespaceLevel[X]"}
   
```json

```js
{
  "moduleName": "",
  "dependsOn": [...],
  "outputsBucket": {}
  "config": {},
  "tasks": [...]
}
```

### `moduleName`

Name of the module e.g `"moduleName": "my-module"`



### script section