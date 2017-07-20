'use strict';

process.env.NODE_ENV = 'test';
let request = require("request");
let assert = require('assert');
let should = require("should");
let server = require('../index');
const base_url = "http://localhost:" + process.env.PORT || 6789 + "/";

describe("Movies backend test", () => {
 
 
  describe("GET /", () => {
    it("returns status code 200", () => {
      request.get(base_url, (error, response, body) => {
        assert.equal(200, response.statusCode);
      });
    });
  });
  
  describe("POST /api/user/subscribe with no username", () => {
    it("returns status code 400", () => {
      request.post({url: base_url + '/api/user/subscribe', form: {password:'test', email:'test@test.com'}}, (error, response, body) => {
        assert.equal(400, response.statusCode);
        done();
      });
    });
  });

  describe("POST /api/user/subscribe with no email", () => {
    it("returns status code 400", () => {
      request.post({url: base_url + '/api/user/subscribe', form: {password:'test', username:'test'}}, (error, response, body) => {
        assert.equal(400, response.statusCode);
        done();
      });
    });
  });

  describe("POST /api/user/subscribe with no password", () => {
    it("returns status code 400", () => {
      request.post({url: base_url + '/api/user/subscribe', form: {email:'test@test.com', username:'test'}}, (error, response, body) => {
        assert.equal(400, response.statusCode);
        done();
      });
    });
  });

  describe("POST /api/user/subscribe with bad length for password", () => {
    it("returns status code 400", () => {
      request.post({url: base_url + '/api/user/subscribe', form: {email:'test@test.com', username:'test', password:'te'}}, (error, response, body) => {
        assert.equal(400, response.statusCode);
        done();
      });
    });
  });

  describe("POST /api/user/subscribe with bad length for username", () => {
    it("returns status code 400", () => {
      request.post({url: base_url + '/api/user/subscribe', form: {email:'test@test.com', username:'te', password:'test'}}, (error, response, body) => {
        assert.equal(400, response.statusCode);
        done();
      });
    });
  });

  describe("POST /api/user/subscribe with bad length for email", () => {
    it("returns status code 400", () => {
      request.post({url: base_url + '/api/user/subscribe', form: {email:'te', username:'test', password:'test'}}, (error, response, body) => {
        assert.equal(400, response.statusCode);
        done();
      });
    });
  });

  describe("POST /api/user/connect with no username", () => {
    it("returns status code 400", () => {
      request.post({url: base_url + '/api/user/connect', form: {password:'test'}}, (error, response, body) => {
        assert.equal(400, response.statusCode);
        done();
      });
    });
  });

  describe("POST /api/user/connect with no password", () => {
    it("returns status code 400", () => {
      request.post({url: base_url + '/api/user/connect', form: {username:'test'}}, (error, response, body) => {
        assert.equal(200, response.statusCode);
        done();
      });
    });
  });

});