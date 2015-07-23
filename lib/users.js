module.exports = Users;

function Users(helpscout) {
    this.helpscout = helpscout;
}

/**
* Get the User who authorized Help Scout.
*
* @param {Function} callback
*/

Users.prototype.getMe = function(callback) {
    this.helpscout.request({
        method: 'get',
        path: '/users/me.json',
        callback: callback
    });
};
