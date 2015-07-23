module.exports = Hooks;

function Hooks(helpscout) {
    this.helpscout = helpscout;
}

Hooks.prototype.create = function(hook, callback) {
    this.helpscout.request({
        method: 'post',
        path: '/hooks.json',
        data: hook,
        callback: callback
    });
};
