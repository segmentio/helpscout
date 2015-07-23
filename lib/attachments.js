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
 * @param {Object} options
 * @param {Object} options.attachment
 * @param {Number} options.timeout
 * @param {Function} callback
 */

Attachments.prototype.create = function(options, callback) {
    options = defaults(options, {
        timeout: 0,
        attachment: {}
    });

    options.attachment = defaults(options.attachment, {
        mimeType: 'text/plain'
    });

    this.helpscout.request({
        method: 'post',
        path: '/attachments.json',
        data: options.attachment,
        timeout: options.timeout,
        callback: callback
    });
};
