# kumo-plugins

## Plugin structure

```bash
{
	function actions() {
		// returns list of supported actions
	}

	function invokeAction(action, options, context) {
		// Do the work

		context.cwd
		context.logger

	}
}
```
