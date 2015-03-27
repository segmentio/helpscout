
var Mailboxes = require('./mailboxes');
var Attachments = require('./attachments');

/**
 * Expose `Helpscout`.
 */

module.exports = Helpscout;

/**
 * Initialize a new `Helpscout` client with an `apiKey`.
 *
 * @param {String} apiKey
 */

function Helpscout (apiKey) {
  if (!(this instanceof Helpscout)) return new Helpscout(apiKey);
  if (!apiKey) throw new Error('Helpscout requires an apiKey.');
  this.apiKey = apiKey;
  this.mailboxes = new Mailboxes(apiKey);
  this.attachments = new Attachments(apiKey);
}
