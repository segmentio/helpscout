
var debug = require('debug')('helpscout:conversations');
var defaults = require('defaults');
var request = require('superagent');

/**
 * Expose `Conversations`.
 */

module.exports = Conversations;

/**
 * Initialize a new helpscout `Conversations` client with an
 * `apiKey` and `mailboxId`.
 *
 * @param {String} apiKey
 * @param {String} mailboxId
 */

function Conversations (apiKey, mailboxId) {
  if (!(this instanceof Conversations)) return new Conversations(apiKey, mailboxId);
  if (!apiKey) throw new Error('Conversations requires an apiKey.');
  if (!mailboxId) throw new Error('Conversations requires a mailboxId.');
  this.apiKey = apiKey;
  this.mailboxId = mailboxId;
}

/**
 * List the mailbox's conversations.
 *
 * @param {Object} options
 *   @param {Number} page
 * @param {Function} callback
 */

Conversations.prototype.list = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = defaults(options, { status: 'all', page: 1, tag: null });
  debug('requesting conversations [page %d] ..', options.page);
  request
    .get('https://api.helpscout.net/v1/mailboxes/' + this.mailboxId + '/conversations.json')
    .auth(this.apiKey, 'X')
    .query(options)
    .end(function (err, res) {
      if (err) return callback(err);
      if (res.statusCode !== 200) return callback(new Error('Bad response: ' + res.text));
      debug('got %d conversations for page %d', res.body.items.length, res.body.page);
      return callback(null, res.body);
    });
};

/**
 * Create a conversation in the mailbox.
 *
 * Sample conversation object can be found in the docs:
 * http://developer.helpscout.net/help-desk-api/conversations/create/
 *
 * @param {Object} conversation
 * @param {Function} callback
 */

Conversations.prototype.create = function(conversation, callback) {
  conversation = defaults(conversation, { mailbox: { id: this.mailboxId } });
  debug('requesting creations of a conversation on mailbox %d', this.mailboxId);
  request
    .post('https://api.helpscout.net/v1/conversations.json')
    .auth(this.apiKey, 'X')
    .send(conversation)
    .end(function(err, res) {
      if (err) return callback(err);
      if (res.statusCode !== 201) return callback(new Error('Bad response: ' +res.text));
      debug('created conversation in mailbox %d', this.mailboxId);
      return callback(null, res.body);
    });
};
