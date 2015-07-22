var defaults = require('defaults');

module.exports = Mailboxes;

function Mailboxes(helpscout) {
    this.helpscout = helpscout;
}

/**
 * List the Helpscout mailboxes.
 *
 * @param {Object} options
 *   @param {Number} page
 * @param {Function} callback
 */

Mailboxes.prototype.list = function(options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    this.helpscout.request({
        method: 'get',
        path: '/mailboxes.json',
        query: defaults(options, {
            page: 1
        }),
        callback: callback
    });
};
