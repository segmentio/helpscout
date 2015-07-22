
# helpscout

  A Helpscout API for node.

## Installation

    $ npm install helpscout

## Example

Create a new Helpscout instance and query for mailboxes: 

```js
var helpscout = require('helpscout')({
	apiKey: 'apikey'
});
```



Or select a default mailbox:

```js
var helpscout = require('helpscout')({
	apiKey: 'apikey', 
	mailboxId: 6314
});
```

Then you can query mailbox conversations:

```js
helpscout.conversations.list(options, function (err, conversations) {
  // ..
});
```

## API

#### new Helpscout(apiKey)

Create a new `Helpscout` client to query `Mailboxes`.

#### #list([options,] callback)

Returns a [list of mailboxes](http://developer.helpscout.net/help-desk-api/mailboxes/list/), with options defaulted to:

```js
{
    page: 1
}
```

#### new Helpscout(apiKey, mailboxId)

Create a new `Mailbox` client.

##### #conversations.list([options,] callback)

Returns a [list of conversations](http://developer.helpscout.net/help-desk-api/conversations/list/), with options defaulted to:

```js
{
    page: 1,
    status: 'all'
    tag: null
}
```

## License

MIT