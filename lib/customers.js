var debug = require('debug')('helpscout:conversations');
var request = require('superagent');

/**
* Expose `Customers`.
*/

module.exports = Customers;

/**
* Initialize a new helpscout `Customers` client with an
* `apiKey`.
*
* @param {String} apiKey
*/

function Customers(apiKey) {
  if (!(this instanceof Customers)) {
    return new Customers(apiKey);
  }
  if (!apiKey) {
    throw new Error('Threads requires an apiKey.');
  }
  this.apiKey = apiKey;
}

/**
* Get a customer by email.
*/

Customers.prototype.getCustomerByEmail = function(email, callback) {
  debug('requesting customer by email ' + email);
  request
    .get('https://api.helpscout.net/v1/customers.json?email=' + email)
    .auth(this.apiKey, 'X')
    .end(function(err, res) {
      if (err) return callback(err);
      debug('requested user with email ' + email);
      return callback(null, res.body);
    });
};

Customers.prototype.create = function(profile, callback) {
  debug('creating customer with profile' + JSON.toString(profile));
  request
    .post('https://api.helpscout.net/v1/customers.json')
    .auth(this.apiKey, 'X')
    .send(profile)
    .end(function(err, res) {
      if (err) return callback(err);
      debug('created customer with profile' + JSON.toString(profile));
      return callback(null, res.body);
    });
};