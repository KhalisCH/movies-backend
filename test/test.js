let request = require("request");
let assert = require('assert');
let api = require("../index.js");
const base_url = "http://localhost:6789/";

describe("Movies backend test", () => {
  describe("GET /", () => {

    it("returns status code 200", () => {

      request.get(base_url, (error, response, body) => {
        assert.equal(200, response.statusCode);
        api.closeServer();
        done();
      });

    });

  });

});