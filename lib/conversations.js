var defaults = require('defaults');

module.exports = Conversations;

function Conversations(helpscout) {
    this.helpscout = helpscout;
}

/**
 * List the mailbox's conversations.
 *
 * @param {Object} options
 * @param {String} options.mailboxId
 * @param {Object} options.query
 * @param {Function} callback
 */

Conversations.prototype.list = function(options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    options = defaults(options, {
        mailboxId: this.helpscout.config.mailboxId,
        query: {
            status: 'all',
            page: 1,
            tag: null
        }
    });

    this.helpscout.request({
        method: 'get',
        path: '/mailboxes/' + options.mailboxId + '/conversations.json',
        query: options.query,
        callback: callback
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
    this.helpscout.request({
        method: 'post',
        path: '/conversations.json',
        data: defaults(conversation, {
            mailbox: {
                id: this.helpscout.config.mailboxId
            }
        }),
        callback: callback
    });
};

/**
 * GET a conversation by ID.
 *
 * Sample conversation object can be found in the docs:
 * http://developer.helpscout.net/help-desk-api/conversations/create/
 *
 * @param {String} id
 * @param {Function} callback
 */

Conversations.prototype.get = function(id, callback) {
    this.helpscout.request({
        method: 'get',
        path: '/conversations/' + id + '.json',
        callback: callback
    });
};
