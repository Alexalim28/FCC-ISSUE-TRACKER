const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Testing POST /api/issues/apitest routes", function () {
    test("POST request with every fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "A new issue",
          issue_text: "Some description",
          created_by: "Salim",
          assigned_to: "Alex",
          status_text: "in Qa",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.issue_title, "A new issue");
          assert.equal(res.body.issue_text, "Some description");
          assert.equal(res.body.created_by, "Salim");
          assert.equal(res.body.assigned_to, "Alex");
          assert.equal(res.body.status_text, "in Qa");
          done();
        });
    });
  });
});
