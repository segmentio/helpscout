module.exports = Customers;

function Customers(helpscout) {
    this.helpscout = helpscout;
}

/**
 * Get a customer by email
 *
 * @param {String} email
 * @param {Function} callback
 */

Customers.prototype.getByEmail = function(email, callback) {
    this.helpscout.request({
        method: 'get',
        path: '/customers.json',
        query: {
            email: email
        },
        callback: callback
    });
};

/**
 * Create a customer profile
 *
 * @param {Object} profile
 * @param {Function} callback
 */

Customers.prototype.create = function(profile, callback) {
    this.helpscout.request({
        method: 'post',
        path: '/customers.json',
        data: profile,
        callback: callback
    });
};
