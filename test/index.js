
var assert = require('assert');
var Helpscout = require('..');
var util = require('util');

describe('helpscout', function () {

  var apiKey = 'b7fb92dc098366785915041b9e5bfb3e3313f004';
  var mailboxId = '49256';

  describe('#hooks', function() {
    describe('#create', function() {
      it('should return an empty object', function(done) {
        var helpscout = Helpscout(apiKey);
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
        var helpscout = Helpscout(apiKey);
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


    describe('#getCustomerByEmail', function() {
      it('should return an array containing a customer with matching email address', function(done) {
        var email = "test" + Date.now() + "@example.com";
        var helpscout = Helpscout(apiKey);
        var mailbox = Helpscout(apiKey, mailboxId);
        mailbox.conversations.create({
          "type": "email",
          "customer": {
            "email": email,
            "firstName": "Joey",
            "lastName": "Customer",
            "type": "customer"
          },
          "subject": "Help!",
          "tags": [
            "Bug Fix"
          ],
          "threads": [
            {
              "type": "customer",
              "createdBy": {
                "email": email,
                "firstName": "Joey",
                "lastName": "Customer",
                "type": "customer"
              },
              "body": "I broke everything."
            }
          ]
        }, function(err, res) {
          // This test is prone to race conditions.
          // It takes time for Help Scout to index the user by email address.
          // For some reason implicit creation of a user through a conversation
          // allows for faster indexing than explicitly creating a user.
          // hence the conversation posting; and 1 sec timeout, below.
          setTimeout(function() {
            helpscout.customers.getCustomerByEmail(email, function(err, res) {
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
        var helpscout = Helpscout(apiKey);
        helpscout.users.getMe(function (err, res) {
          if (err) return done(err);
          assert(res);
          assert(res.item.id);
          done();
        });
      });
    });
  });

  describe('#mailboxes', function () {
    describe('#list', function () {
      it('should be able to get a list of mailboxes', function (done) {
        var helpscout = Helpscout(apiKey);
        helpscout.mailboxes.list(function (err, res) {
          if (err) return done(err);
          assert(res);
          assert(Array.isArray(res.items));
          done();
        });
      });
    });
  });

  describe('#conversations', function () {
    describe('#list', function () {
      it('should be able to get a list of conversations', function (done) {
        var mailbox = Helpscout(apiKey, mailboxId);
        mailbox.conversations.list(function (err, res) {
          if (err) return done(err);
          assert(res);
          assert(Array.isArray(res.items));
          done();
        });
      });

      it('should be able to get a list of active conversations', function (done) {
        var mailbox = Helpscout(apiKey, mailboxId);
        mailbox.conversations.list({ status: 'active' }, function (err, res) {
          if (err) return done(err);
          assert(res);
          assert(Array.isArray(res.items));
          done();
        });
      });
    });

    describe('#create', function () {
      it('should be able to create a conversation', function (done) {
        var mailbox = Helpscout(apiKey, mailboxId);
        mailbox.conversations.create({
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
          "threads": [
            {
              "type": "customer",
              "createdBy": {
                "email": "customer@example.com",
                "firstName": "Joey",
                "lastName": "Customer",
                "type": "customer"
              },
              "body": "I broke everything."
            }
          ]
        }, function (err, res) {
          if (err) return done(err);
          assert(res);
          done();
        });
      });
    });
  });

  describe('#attachments', function () {
    describe('#create', function () {
      it('should be able to create an attachment', function (done) {
        var helpscout = Helpscout(apiKey);
        helpscout.attachments.create({
          fileName: 'test.txt',
          data: 'dGVzdA=='
        }, function (err, res) {
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
        var mailbox = Helpscout(apiKey, mailboxId);
        mailbox.conversations.create({
          "reload": true,
          "type": "chat",
          "customer": {
            "email": "jane.customer@example.com",
            "firstName": "Jane",
            "lastName": "Customer",
            "type": "customer"
          },
          "subject": "ok",
          "tags": [
            "Help Request"
          ],
          "threads": [
            {
              "type": "customer",
              "createdBy": {
                "email": "jane.customer@example.com",
                "type": "customer"
              },
              "body": "I need some help."
            }
          ]
        }, function(err, res) {
          if (err) return done(err);
          var helpscout = Helpscout(apiKey);
          helpscout.threads.create({
            "id": res.item.id,
            "thread": {
              "createdBy": {
                "email": "jane.customer@example.com",
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

});
