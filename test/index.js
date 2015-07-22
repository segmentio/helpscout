
var assert = require('assert');
var Helpscout = require('..');

describe('helpscout', function() {

    var config;
    var testConversation;

    beforeEach(function() {
        config = {
            apiKey: 'mySecretKey',
            defaultRetryDelay: 0.001,
            mailboxId: 'myMailboxId'
        };

        testConversation = {
            "type": "email",
            "customer": {
                "email": "customer@example.com",
                "firstName": "Joey",
                "lastName": "Customer",
                "type": "customer"
            },
            "subject": "Help!",
            "tags": [
                "Bug Fix"
            ],
            "threads": [{
                "type": "customer",
                "createdBy": {
                    "email": "customer@example.com",
                    "firstName": "Joey",
                    "lastName": "Customer",
                    "type": "customer"
                },
                "body": "I broke everything."
            }]
        };
    });

    describe('#hooks', function() {
        describe('#create', function() {
            it('should return an empty object', function(done) {
                var helpscout = Helpscout(config);
                helpscout.request();
                helpscout.hooks.create({
                    "url": "https://example.com/helpscout",
                    "events": [],
                    "secret": "mZ9XbGHodX"
                }, function(err, res) {
                    assert(err === null);
                    assert(res);
                    done();
                });
            });
        });
    });

    describe('#customers', function() {
        describe('#create', function() {
            it('should return a newly created customer', function(done) {
                var helpscout = Helpscout(config);
                helpscout.customers.create({
                    "reload": true,
                    "firstName": "The Red Masque",
                    "lastName": "of Death"
                }, function(err, res) {
                    if (err) return done(err);
                    assert(res.item.id);
                    done();
                });
            });
        });


        describe('#getByEmail', function() {
            it('should return an array containing a customer with matching email address', function(done) {
                var helpscout = Helpscout(config);
                var email = "test" + Date.now() + "@example.com";
                testConversation.customer.email = email;
                testConversation.threads[0].createdBy.email = email;
                helpscout.conversations.create(testConversation, function(err, res) {

                    // This test is prone to race conditions.
                    // It takes time for Help Scout to index the user by email address.
                    // For some reason implicit creation of a user through a conversation
                    // allows for faster indexing than explicitly creating a user.
                    // hence the conversation posting; and 1 sec timeout, below.
                    setTimeout(function() {
                        helpscout.customers.getByEmail(email, function(err, res) {
                            if (err) return done(err);
                            assert(res);
                            assert(Array.isArray(res.items));
                            assert(res.items[0].firstName === 'Joey');
                            done();
                        });
                    }, 1000);
                });
            });
        });
    });

    describe('#users', function() {
        describe('#me', function() {
            it('should return the authorizing user', function(done) {
                var helpscout = Helpscout(config);
                helpscout.users.getMe(function(err, res) {
                    if (err) return done(err);
                    assert(res);
                    assert(res.item.id);
                    done();
                });
            });
        });
    });

    describe('#mailboxes', function() {
        describe('#list', function() {
            it('should be able to get a list of mailboxes', function(done) {
                var helpscout = Helpscout(config);
                helpscout.mailboxes.list(function(err, res) {
                    if (err) return done(err);
                    assert(res);
                    assert(Array.isArray(res.items));
                    done();
                });
            });
        });
    });

    describe('#conversations', function() {
        describe('#list', function() {
            it('should be able to get a list of conversations', function(done) {
                var helpscout = Helpscout(config);
                helpscout.conversations.list(function(err, res) {
                    if (err) return done(err);
                    assert(res);
                    assert(Array.isArray(res.items));
                    done();
                });
            });

            it('should be able to get a list of active conversations', function(done) {
                var helpscout = Helpscout(config);
                helpscout.conversations.list({
                    status: 'active'
                }, function(err, res) {
                    if (err) return done(err);
                    assert(res);
                    assert(Array.isArray(res.items));
                    done();
                });
            });
        });

        describe('#create', function() {
            it('should be able to create a conversation', function(done) {
                var helpscout = Helpscout(config);
                helpscout.conversations.create(testConversation, function(err, res) {
                    if (err) return done(err);
                    assert(res);
                    done();
                });
            });
        });
    });

    describe('#attachments', function() {
        describe('#create', function() {
            it('should be able to create an attachment', function(done) {
                var helpscout = Helpscout(config);
                helpscout.attachments.create({
                    fileName: 'test.txt',
                    data: 'dGVzdA=='
                }, function(err, res) {
                    if (err) return done(err);
                    assert(res);
                    done();
                });
            });
        });
    });

    describe('#thread', function() {
        describe('#create', function() {
            it('should be able to create a thread', function(done) {

                var helpscout = Helpscout(config);
                testConversation.reload = true;
                testConversation.type = 'chat';

                helpscout.conversations.create(testConversation, function(err, res) {
                    if (err) return done(err);
                    var helpscout = Helpscout(config);
                    helpscout.threads.create({
                        "id": res.item.id,
                        "thread": {
                            "createdBy": {
                                "email": "customer@example.com",
                                "type": "customer"
                            },
                            "type": "customer",
                            "body": "Oops, nevermind. Code 18!",
                            "status": "active"
                        }
                    }, function(err, res) {
                        if (err) return done(err);
                        assert(res);
                        done();
                    });
                });
            });
        });
    });

    describe('#request', function() {
        it('should delay exponentially on retry', function(done) {
            config.defaultRetryDelay = 0.1;
            config.apiRoot = 'http://thisdomainmostdefinitelydoesnotexist.tv/';
            var helpscout = Helpscout(config);

            var startTime = new Date().getTime();
            helpscout.request({
                path: '/users.json',
                callback: function(err, res) {
                    var endTime = new Date().getTime();
                    assert((endTime - startTime) > 630);
                    done();
                }
            });
        });

        it('should append global query string', function(done) {
            config.query = {
                page: 2
            };
            var helpscout = Helpscout(config);

            helpscout.conversations.list({
                query: {}
            }, function(err, res) {
                assert(res.page === 2);
                done();
            });
        });
    });
});
