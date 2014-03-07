
var Conversations = require('./conversations');

/**
 * Expose `Mailbox`.
 */

module.exports = Mailbox;

/**
 * Initialize a new `Mailbox` client with the `apiKey` and `mailboxId`.
 *
 * @param {String} apiKey
 * @param {String} mailboxId
 */

function Mailbox (apiKey, mailboxId) {
  if (!(this instanceof Mailbox)) return new Mailbox(apiKey, mailboxId);
  if (!apiKey) throw new Error('Mailbox requires an apiKey.');
  if (!mailboxId) throw new Error('Mailbox requires a mailboxId.');
  this.apiKey = apiKey;
  this.mailboxId = mailboxId;
  this.conversations = new Conversations(apiKey, mailboxId);
}
