
var debug = require('debug')('helpscout:mailboxes');
var defaults = require('defaults');
var request = require('superagent');

/**
 * Expose `Mailboxes`.
 */

module.exports = Mailboxes;

/**
 * Initialize a new `Mailboxes` client with an `apiKey`.
 *
 * @param {String} apiKey
 */

function Mailboxes (apiKey) {
  if (!(this instanceof Mailboxes)) return new Mailboxes(apiKey);
  if (!apiKey) throw new Error('Mailboxes requires an apiKey.');
  this.apiKey = apiKey;
}

/**
 * List the Helpscout mailboxes.
 *
 * @param {Object} options
 *   @param {Number} page
 * @param {Function} callback
 */

Mailboxes.prototype.list = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = defaults(options, { page: 1 });
  debug('requesting mailboxes ..');
  request
    .get('https://api.helpscout.net/v1/mailboxes.json')
    .auth(this.apiKey, 'X')
    .query(options)
    .end(function (err, res) {
      if (err) return callback(err);
      if (res.statusCode !== 200) return callback(new Error('Bad response: ' + res.text));
      debug('got %d mailboxes', res.body.count);
      return callback(null, res.body);
    });
};