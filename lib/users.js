var debug = require('debug')('helpscout:conversations');
var request = require('superagent');

/**
* Expose `Users`.
*/

module.exports = Users;

/**
* Initialize a new helpscout `USers` client with an
* `apiKey`.
*
* @param {String} apiKey
*/

function Users(apiKey) {
  if (!(this instanceof Users)) {
    return new Users(apiKey);
  }
  if (!apiKey) {
    throw new Error('Threads requires an apiKey.');
  }
  this.apiKey = apiKey;
}

/**
* Get the User who authorized Help Scout.
*/

Users.prototype.getMe = function(callback) {
  debug('requesting user "me"');
  request
    .get('https://api.helpscout.net/v1/users/me.json')
    .auth(this.apiKey, 'X')
    .end(function(err, res) {
      if (err) return callback(err);
      debug('requested user "me"');
      return callback(null, res.body);
    });
};