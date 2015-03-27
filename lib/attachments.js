var debug = require('debug')('helpscout:conversations');
var defaults = require('defaults');
var request = require('superagent');

/**
 * Expose `Attachments`.
 */

module.exports = Attachments;

/**
 * Initialize a new helpscout `Attachments` client with an `apiKey`.
 *
 * @param {String} apiKey
 */

function Attachments (apiKey) {
  if (!(this instanceof Attachments)) return new Conversations(apiKey);
  if (!apiKey) throw new Error('Conversations requires an apiKey.');
  this.apiKey = apiKey;
}

/**
 * Create a new attachment.
 *
 * Sample attachment object can be found in the docs:
 * http://developer.helpscout.net/help-desk-api/conversations/create-attachment/
 *
 * @param {Object} attachment
 * @param {Function} callback
 */

Attachments.prototype.create = function(attachment, callback) {
  attachment = defaults(attachment, { mimeType: 'text/plain' });
  debug('requesting creations of an attachment');
  request
    .post('https://api.helpscout.net/v1/conversations.json')
    .auth(this.apiKey, 'X')
    .send(attachment)
    .end(function(err, res) {
      if (err) return callback(err);
      if (res.statusCode !== 201) return callback(new Error('Bad response: ' +res.text));
      debug('created attachment with id %d');
      return callback(null, res.body);
    });
};
