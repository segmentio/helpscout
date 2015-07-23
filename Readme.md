
# Helpscout

  A Helpscout API for node.

## Installation

    $ npm install helpscout

## Example

Create a new Helpscout instance with config object and fetch the user: 

```js
var helpscout = require('helpscout')({
	apiKey: 'apikey'
});

helpscout.users.getMe(function(user){
	// Done!
});
```

## Config Object
- **apiKey** (Required) Api key to access helpscout
- **mailboxId** (Optional) default mailbox id to use when listing conversations or creating a conversation
- **maxRetries** (Optional) Number of times to retry in case of failure. Defaults to 3
- **defaultRetryDelay** (Optional) Number of seconds to wait before retrying. Defaults to 1. After each retry the wait time is doubled.
- **apiVersion** (Optional) Api version to access. Defaults to 'v1'
- **apiRoot** (Optional) Change the endpoint. Can be useful for testing. Defaults to https://api.helpscout.net/
- *query* (Optional) Default query string to attach to each request
- *retryList* (Optional) Default list of error codes to retry on. Defaults to [429,500,503]

## Instance Methods

helpscout.

## License

MIT