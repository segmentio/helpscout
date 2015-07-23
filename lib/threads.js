var defaults = require('defaults');

module.exports = Threads;

function Threads(helpscout) {
    this.helpscout = helpscout;
}

/**
* Create a thread inside of a conversation.
* 
* Sample thread object can be found in the docs:
* http://developer.helpscout.net/help-desk-api/conversations/create-thread/
*
* @param {Object} options
* @param {String} options.id
* @param {Object} options.thread
* @param {Function} callback
*/

Threads.prototype.create = function(options, callback) {
    optiosn = defaults(options, {
        id: '',
        thread: {}
    });

    this.helpscout.request({
        method: 'post',
        path: '/conversations/' + options.id + '.json',
        data: options.thread,
        callback: callback
    });
};
