var Helpscout = require('..');
var superagent = require('superagent');
var sinon = require('sinon');
var chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));


describe('helpscout', function() {

    var getSpy;
    var postSpy;
    var putSpy;
    var sendSpy;
    var endStub;
    var querySpy;
    var timeoutSpy;
    var config;

    beforeEach(function() {
        config = {
            apiKey: 'mySecretKey',
            mailboxId: 'myMailboxId'
        };

        getSpy = sinon.spy(superagent, 'get');
        postSpy = sinon.spy(superagent, 'post');
        putSpy = sinon.spy(superagent, 'put');
        querySpy = sinon.spy(superagent.Request.prototype, 'query');
        sendSpy = sinon.spy(superagent.Request.prototype, 'send');
        timeoutSpy = sinon.spy(superagent.Request.prototype, 'timeout');
        endStub = sinon.stub(superagent.Request.prototype, 'end', function(callback) {
            this._callback = function() {};
            callback(null, {
                success: 'true'
            });
        });
    });

    afterEach(function() {
        getSpy.restore();
        postSpy.restore();
        putSpy.restore();
        sendSpy.restore();
        endStub.restore();
        querySpy.restore();
        timeoutSpy.restore();
    });

    it('should fail if no apiKey is provided', function() {
        try {
            Helpscout({});
        } catch ( e ) {
            chai.assert(e.message === "Helpscout requires an apiKey.");
        }
    });

    it('should create instance without new keyword', function() {
        var helpscout = Helpscout(config);
        chai.assert(helpscout instanceof Helpscout);
    });

    it('should create instance with new keyword', function() {
        var helpscout = new Helpscout(config);
        chai.assert(helpscout instanceof Helpscout);
    });

    describe('request', function() {

        it('should use configured apiRoot', function(done) {
            config.apiRoot = 'http://new.api.com/';
            Helpscout(config).users.getMe(function() {
                getSpy.should.have.been.calledOnce;
                getSpy.should.have.been.calledWith('http://new.api.com/v1/users/me.json');
                done();
            });
        });

        it('should use configured apiVersion', function(done) {
            config.apiVersion = 'v3';
            Helpscout(config).users.getMe(function() {
                getSpy.should.have.been.calledOnce;
                getSpy.should.have.been.calledWith('https://api.helpscout.net/v3/users/me.json');
                done();
            });
        });

        it('should use configured timeout', function(done) {
            config.timeout = 10000;
            Helpscout(config).users.getMe(function() {
                timeoutSpy.should.have.been.calledOnce;
                chai.assert(timeoutSpy.args[0][0] === 10000);
                done();
            });
        });

        it('should provide default callback if none provided', function() {
            Helpscout(config).users.getMe();
            getSpy.should.have.been.calledOnce;
            getSpy.should.have.been.calledWith('https://api.helpscout.net/v1/users/me.json');
        });

        it('should retry on 429 error', function(done) {
            config.defaultRetryDelay = 0.01;
            config.maxRetries = 2;
            endStub.restore();
            endStub = sinon.stub(superagent.Request.prototype, 'end', function(callback) {
                this._callback = function() {};
                callback({
                    status: 429
                });
            });

            Helpscout(config).users.getMe(function(err, res) {
                getSpy.should.have.been.calledThrice;
                done();
            });
        });

        it('should not retry on 401 error', function(done) {
            config.defaultRetryDelay = 0.01;
            config.maxRetries = 2;
            endStub.restore();
            endStub = sinon.stub(superagent.Request.prototype, 'end', function(callback) {
                this._callback = function() {};
                callback({
                    status: 401
                });
            });

            Helpscout(config).users.getMe(function(err, res) {
                getSpy.should.have.been.calledOnce;
                done();
            });
        });

        it('should retry on timeouts', function(done) {
            config.defaultRetryDelay = 0.01;
            config.maxRetries = 2;
            endStub.restore();
            endStub = sinon.stub(superagent.Request.prototype, 'end', function(callback) {
                this._callback = function() {};
                callback({});
            });

            Helpscout(config).users.getMe(function(err, res) {
                getSpy.should.have.been.calledThrice;
                done();
            });
        });

        it('should respect retry-after header', function(done) {
            config.defaultRetryDelay = 0.01;
            config.maxRetries = 1;
            endStub.restore();
            endStub = sinon.stub(superagent.Request.prototype, 'end', function(callback) {
                this._callback = function() {};
                callback({
                    status: 500
                }, {
                    header: {
                        'retry-after': 1
                    }
                });
            });

            var startTime = new Date().getTime();
            Helpscout(config).users.getMe(function(err, res) {
                var endTime = new Date().getTime();
                getSpy.should.have.been.calledTwice;
                chai.assert(endTime - startTime > 1000);
                done();
            });
        });
    });

    describe('attachments', function() {

        describe('create', function() {

            it('should add mimeType', function(done) {
                Helpscout(config).attachments.create({
                    attachment: {
                        fileName: 'test.txt',
                        data: 'dGVzdA=='
                    }
                }, function() {
                    postSpy.should.have.been.calledOnce;
                    postSpy.should.have.been.calledWith('https://api.helpscout.net/v1/attachments.json');
                    sendSpy.should.have.been.calledOnce;
                    chai.assert(sendSpy.args[0][0].mimeType === "text/plain");
                    done();
                });
            });

            it('should default to no timeout', function(done) {
                Helpscout(config).attachments.create({
                    attachment: {
                        fileName: 'test.txt',
                        data: 'dGVzdA=='
                    }
                }, function() {
                    postSpy.should.have.been.calledOnce;
                    postSpy.should.have.been.calledWith('https://api.helpscout.net/v1/attachments.json');
                    timeoutSpy.should.have.been.calledOnce;
                    chai.assert(timeoutSpy.args[0][0] === 0);
                    done();
                });
            });

            it('should allow timeout override', function(done) {
                Helpscout(config).attachments.create({
                    timeout: 20000,
                    attachment: {
                        fileName: 'test.txt',
                        data: 'dGVzdA=='
                    }
                }, function() {
                    postSpy.should.have.been.calledOnce;
                    postSpy.should.have.been.calledWith('https://api.helpscout.net/v1/attachments.json');
                    timeoutSpy.should.have.been.calledOnce;
                    chai.assert(timeoutSpy.args[0][0] === 20000);
                    done();
                });
            });
        });
    });

    describe('conversations', function() {

        describe('list', function() {

            it('should add default query params', function(done) {
                var url = 'https://api.helpscout.net/v1/mailboxes/' + config.mailboxId + '/conversations.json';
                Helpscout(config).conversations.list(function() {
                    getSpy.should.have.been.calledOnce;
                    getSpy.should.have.been.calledWith(url);
                    querySpy.should.have.been.calledThrice;
                    chai.assert(querySpy.args[2][0].status === 'all');
                    chai.assert(querySpy.args[2][0].page === 1);
                    chai.assert(querySpy.args[2][0].tag === null);
                    done();
                });
            });

            it('should allow custom mailbox param', function(done) {
                var url = 'https://api.helpscout.net/v1/mailboxes/' + config.mailboxId + '/conversations.json';
                Helpscout(config).conversations.list({
                    mailboxId: config.mailboxId
                }, function() {
                    getSpy.should.have.been.calledOnce;
                    getSpy.should.have.been.calledWith(url);
                    querySpy.should.have.been.calledThrice;
                    chai.assert(querySpy.args[2][0].status === 'all');
                    chai.assert(querySpy.args[2][0].page === 1);
                    chai.assert(querySpy.args[2][0].tag === null);
                    done();
                });
            });
        });

        describe('create', function() {

            it('should add default mailboxId', function(done) {
                Helpscout(config).conversations.create({}, function() {
                    postSpy.should.have.been.calledOnce;
                    postSpy.should.have.been.calledWith('https://api.helpscout.net/v1/conversations.json');
                    sendSpy.should.have.been.calledOnce;
                    sendSpy.should.have.been.calledWith({
                        mailbox: {
                            id: config.mailboxId
                        }
                    });
                    done();
                });
            });
        });
    });

    describe('customers', function() {

        describe('getByEmail', function() {

            it('should call endpoint with email', function(done) {
                Helpscout(config).customers.getByEmail('test@email.com', function() {
                    getSpy.should.have.been.calledOnce;
                    getSpy.should.have.been.calledWith('https://api.helpscout.net/v1/customers.json');
                    querySpy.should.have.been.calledThrice;
                    chai.assert(querySpy.args[2][0].email === 'test@email.com');
                    done();
                });
            });
        });

        describe('create', function() {

            it('should post profile', function(done) {
                Helpscout(config).customers.create('profile', function() {
                    postSpy.should.have.been.calledOnce;
                    postSpy.should.have.been.calledWith('https://api.helpscout.net/v1/customers.json');
                    sendSpy.should.have.been.calledOnce;
                    chai.assert(sendSpy.args[0][0] === 'profile');
                    done();
                });
            });
        });

        describe('update', function() {

            it('should update profile', function(done) {
                Helpscout(config).customers.update('12345', 'profile', function() {
                    putSpy.should.have.been.calledOnce;
                    putSpy.should.have.been.calledWith('https://api.helpscout.net/v1/customers/12345.json');
                    sendSpy.should.have.been.calledOnce;
                    chai.assert(sendSpy.args[0][0] === 'profile');
                    done();
                });
            });
        });
    });

    describe('hooks', function() {

        describe('create', function() {

            it('should post hook', function(done) {
                Helpscout(config).hooks.create('hook', function() {
                    postSpy.should.have.been.calledOnce;
                    postSpy.should.have.been.calledWith('https://api.helpscout.net/v1/hooks.json');
                    sendSpy.should.have.been.calledOnce;
                    chai.assert(sendSpy.args[0][0] === 'hook');
                    done();
                });
            });
        });
    });

    describe('mailboxes', function() {

        describe('list', function() {

            it('should provide default query params', function(done) {
                Helpscout(config).mailboxes.list(function() {
                    getSpy.should.have.been.calledOnce;
                    getSpy.should.have.been.calledWith('https://api.helpscout.net/v1/mailboxes.json');
                    querySpy.should.have.been.calledThrice;
                    chai.assert(querySpy.args[2][0].page === 1);
                    done();
                });
            });

            it('should accept optional query params', function(done) {
                Helpscout(config).mailboxes.list({
                    page: 2
                }, function() {
                    getSpy.should.have.been.calledOnce;
                    getSpy.should.have.been.calledWith('https://api.helpscout.net/v1/mailboxes.json');
                    querySpy.should.have.been.calledThrice;
                    chai.assert(querySpy.args[2][0].page === 2);
                    done();
                });
            });
        });
    });

    describe('threads', function() {

        describe('create', function() {

            it('should call endpoint with default options', function(done) {
                Helpscout(config).threads.create({}, function() {
                    postSpy.should.have.been.calledOnce;
                    postSpy.should.have.been.calledWith('https://api.helpscout.net/v1/conversations/.json');
                    sendSpy.should.have.been.calledOnce;
                    chai.assert(typeof sendSpy.args[0][0] === 'object');
                    done();
                });
            });

            it('should call endpoint with options specified', function(done) {
                Helpscout(config).threads.create({
                    id: 'test',
                    thread: 'thread'
                }, function() {
                    postSpy.should.have.been.calledOnce;
                    postSpy.should.have.been.calledWith('https://api.helpscout.net/v1/conversations/test.json');
                    sendSpy.should.have.been.calledOnce;
                    chai.assert(sendSpy.args[0][0] === 'thread');
                    done();
                });
            });
        });
    });

    describe('users', function() {

        describe('getMe', function() {

            it('should call me endpoint', function(done) {
                Helpscout(config).users.getMe(function() {
                    getSpy.should.have.been.calledOnce;
                    getSpy.should.have.been.calledWith('https://api.helpscout.net/v1/users/me.json');
                    done();
                });
            });
        });
    });
});
