
var Helpscout = require('./helpscout');
var Mailbox = require('./mailbox');

/**
 * Create a Helpscout or Mailbox client based on the `apiKey`
 * and `mailboxId` passed in.
 *
 * @param {String} apiKey
 * @param {String} mailboxId
 * @return {Helpscout|Mailbox}
 */

module.exports = function helpscout (apiKey, mailboxId) {
  if (!apiKey) throw new Error('Helpscout requires an apiKey.');
  if (mailboxId) return new Mailbox(apiKey, mailboxId);
  else return new Helpscout(apiKey);
};