var defaults = require('defaults');

module.exports = Attachments;

function Attachments(helpscout) {
    this.helpscout = helpscout;
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
    this.helpscout.request({
        method: 'post',
        path: '/attachments.json',
        data: defaults(attachment, {
            mimeType: 'text/plain'
        }),
        callback: callback
    });
};