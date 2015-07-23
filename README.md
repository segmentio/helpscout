
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
- **timeout** (Optional) Request timeout in ms. Defaults to 0 (no timeout)
- **defaultRetryDelay** (Optional) Number of seconds to wait before retrying. Defaults to 1. After each retry the wait time is doubled.
- **apiVersion** (Optional) Api version to access. Defaults to 'v1'
- **apiRoot** (Optional) Change the endpoint. Can be useful for testing. Defaults to https://api.helpscout.net/
- **query** (Optional) Default query string to attach to each request
- **retryList** (Optional) Default list of error codes to retry on. Defaults to [429,500,503]

## Instance Methods

### helpscout.attachments.create(options, callback)

Will create an attachment. Options object can contain timeout and attachment attributes

### helpscout.conversations.list([options,] callback)

Will list conversations on a mailbox. Options can specify mailboxId and query attributes. Query will default to `{ status: 'all', page: 1, tag: null }` and mailboxId will default to instance config.

### helpscout.conversations.create(conversation, callback)

Will create a conversation. conversation mailbox attribute will default to global mailboxId.

### helpscout.customers.getByEmail(email, callback)

Will fetch a custom by email.

### helpscout.customers.create(customer, callback)

Will create a customer specified in the customer object.

### helpscout.hooks.create(hook, callback)

Will create a hook specified in the hook object.

### helpscout.mailboxes.list([options,] callback)

Will list all the mailboxes. Options are query params to send. Options defaults to { page: 1 } 

### helpscout.threads.create(options, callback)

Will create a new thread. Options expects an id attribute of the conversation to create a thread on and a thread attribute which is thread object to create

### helpscout.users.getMe(callback)

Will fetch the user.

## License

MIT
