
var assert = require('assert');
var Helpscout = require('..');
var util = require('util');

describe('helpscout', function () {

  var apiKey = 'helpscout-api-key';
  var mailboxId = 'mailbox-id';

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
});
