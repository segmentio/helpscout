var debug = require('debug')('helpscout:conversations');
var defaults = require('defaults');
var request = require('superagent');
var Attachments = require('./attachments');
var Conversations = require('./conversations');
var Customers = require('./customers');
var Hooks = require('./hooks');
var Mailboxes = require('./mailboxes');
var Threads = require('./threads');
var Users = require('./users');

module.exports = Helpscout;

/**
 * Initialize a new `Helpscout` client with config.
 *
 * @param {Object} config
 *   @param {Number} maxRetries
 *   @param {Number} defaultRetryDelay
 *   @param {String} apiVersion
 *   @param {String} apiRoot
 *   @param {Object} query
 *   @param {String} mailboxId
 *   @param {String} apiKey
 *   @param {Object} retryList
 */

function Helpscout(config) {

    if (!(this instanceof Helpscout)) {
        return new Helpscout(config);
    }

    this.config = defaults(config, {
        maxRetries: 3,
        defaultRetryDelay: 1,
        apiVersion: 'v1',
        apiRoot: 'https://api.helpscout.net/',
        timeout: 0,
        retryList: [
            429,
            500,
            503
        ]
    });

    if (!this.config.apiKey) {
        throw new Error('Helpscout requires an apiKey.');
    }

    this.attachments = new Attachments(this);
    this.conversations = new Conversations(this);
    this.customers = new Customers(this);
    this.hooks = new Hooks(this);
    this.mailboxes = new Mailboxes(this);
    this.threads = new Threads(this);
    this.users = new Users(this);
}

/**
 * Abstraction for making a request with auto retry.
 *
 * @param {Object} options
 *   @param {String} method 
 *   @param {String} path
 *   @param {Object} retryCount
 *   @param {Function} callback
 *   @param {Number} retryAfter
 *   @param {Object} query
 *   @param {Object} data
 */

Helpscout.prototype.request = function(options) {

    options = defaults(options, {
        method: 'get',
        path: '/',
        callback: function() {},
        retryCount: this.config.maxRetries,
        retryAfter: this.config.defaultRetryDelay,
        timeout: this.config.timeout
    });

    debug('Making request', options);
    request[options.method](this.config.apiRoot + this.config.apiVersion + options.path)
        .auth(this.config.apiKey, 'X')
        .query(this.config.query)
        .query(options.query)
        .timeout(options.timeout)
        .send(options.data)
        .end(function(err, res) {

            debug('Request complete', err, res && res.body);
            var isRetryError = err && (!err.status || this.config.retryList.indexOf(err.status) !== -1);
            if (isRetryError && options.retryCount) {

                var retryAfterHeader = res && res.header && parseInt(res.header['retry-after'], 10);
                var retryDelay = retryAfterHeader || options.retryAfter;

                return setTimeout(function() {
                    options.retryCount = options.retryCount - 1;
                    options.retryAfter = options.retryAfter * 2;
                    this.request(options);
                }.bind(this), retryDelay * 1000);
            }

            options.callback(err, res && res.body);
        }.bind(this));
};
