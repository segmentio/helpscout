var Hooks = require('./hooks');
var Mailboxes = require('./mailboxes');
var Attachments = require('./attachments');
var Threads = require('./threads');
var Users = require('./users');
var Customers = require('./customers');

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
  this.hooks = new Hooks(apiKey);
  this.mailboxes = new Mailboxes(apiKey);
  this.attachments = new Attachments(apiKey);
  this.threads = new Threads(apiKey);
  this.users = new Users(apiKey);
  this.customers = new Customers(apiKey);
}
