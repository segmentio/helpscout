var debug = require('debug')('helpscout:conversations');
var request = require('superagent');

/**
* Expose `Threads`.
*/

module.exports = Threads;

/**
* Initialize a new helpscout `Threads` client with an
* `apiKey`.
*
* @param {String} apiKey
*/

function Threads(apiKey) {
  if (!(this instanceof Threads)) {
    return new Threads(apiKey);
  }
  if (!apiKey) {
    throw new Error('Threads requires an apiKey.');
  }
  this.apiKey = apiKey;
}

/**
* Create a thread inside of a conversation.
* 
* Takes an object {id: 'conversation_id', thread: {...}}
* Sample thread object can be found in the docs:
* http://developer.helpscout.net/help-desk-api/conversations/create-thread/
* @param {Object} reqObj
* @param {Function} callback
*/

Threads.prototype.create = function(reqObj, callback) {
  debug('requesting creations of a thread of conversation %d', reqObj.id);
  request
    .post('https://api.helpscout.net/v1/conversations/' + reqObj.id + '.json?supportKit=true')
    .auth(this.apiKey, 'X')
    .send(reqObj.thread)
    .end(function(err, res) {
      if (err) return callback(err);
      if (res.statusCode !== 201) return callback(new Error('Bad response: ' + res.text));
      debug('created thread in conversation %d', reqObj.id);
      return callback(null, res.body);
    });
};
