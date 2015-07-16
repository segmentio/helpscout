var debug = require('debug')('helpscout:conversations');
var request = require('superagent');

/**
* Expose `Hooks`.
*/

module.exports = Hooks;

/**
* Initialize a new helpscout `Hooks` client with an
* `apiKey`.
*
* @param {String} apiKey
*/

function Hooks(apiKey) {
  if (!(this instanceof Hooks)) {
    return new Hooks(apiKey);
  }
  if (!apiKey) {
    throw new Error('Hooks requires an apiKey.');
  }
  this.apiKey = apiKey;
}

Hooks.prototype.create = function(hook, callback) {
  debug('creating hook ' + JSON.toString(hook));
  request
    .post('https://api.helpscout.net/v1/hooks.json')
    .auth(this.apiKey, 'X')
    .send(hook)
    .end(function(err, res) {
      if (err) return callback(err);
      debug('created hook ' + JSON.toString(hook));
      return callback(null, res.body);
    });
};

// for when this endpoint supports a get request

// Hooks.prototype.list = function(callback) {
//   debug('listing hooks');
//   request
//     .get('https://api.helpscout.net/v1/hooks.json')
//     .auth(this.apiKey, 'X')
//     .end(function(err, res) {
//       if (err) return callback(err);
//       debug('listed hooks', res.body);
//       return callback(null, res.body);
//     });
// };