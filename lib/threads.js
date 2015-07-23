module.exports = Threads;

function Threads(helpscout) {
    this.helpscout = helpscout;
}

/**
* Create a thread inside of a conversation.
* 
* Takes an object {id: 'conversation_id', thread: {...}}
* Sample thread object can be found in the docs:
* http://developer.helpscout.net/help-desk-api/conversations/create-thread/
*
* @param {Object} reqObj
* @param {Function} callback
*/

Threads.prototype.create = function(reqObj, callback) {
    this.helpscout.request({
        method: 'post',
        path: '/conversations/' + (reqObj && reqObj.id) + '.json',
        data: (reqObj && reqObj.thread),
        callback: callback
    });
};
