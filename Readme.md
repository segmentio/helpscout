
# helpscout

  Helpscout API for node.

## Installation

    $ npm install helpscout

## Example

Create a new Helpscout instance and query for mailboxes: 

```js
var helpscout = require('helpscout')('apikey');
```

And query mailboxes:

```
helpscout.mailboxes.list(function (err, mailboxes) {
  // ..
});
```

Or select a mailbox:

```js
var mailbox = require('helpscout')('apikey', 6314);
```

Then you can query mailbox conversations:

```js
mailbox.conversations.list(function (err, conversations) {
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