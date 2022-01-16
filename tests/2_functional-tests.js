const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let issueId;
suite("Functional Tests", function () {
  suite("Testing POST /api/issues/{project} routes", function () {
    test("POST request with every fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .set("content-type", "application/json")
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
          issueId = res.body._id;
          assert.equal(res.body.issue_title, "A new issue");
          assert.equal(res.body.issue_text, "Some description");
          assert.equal(res.body.created_by, "Salim");
          assert.equal(res.body.assigned_to, "Alex");
          assert.equal(res.body.status_text, "in Qa");
          assert.property(res.body, "_id");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.propertyVal(res.body, "open", true);
          done();
        });
    });
    test("POST request with only required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .set("content-type", "application/json")
        .send({
          issue_title: "A new issue",
          issue_text: "Some description",
          created_by: "Salim",
          assigned_to: "",
          status_text: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.issue_title, "A new issue");
          assert.equal(res.body.issue_text, "Some description");
          assert.equal(res.body.created_by, "Salim");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });
    test("POST request without required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .set("content-type", "application/json")
        .send({
          issue_title: "",
          issue_text: "Some description",
          created_by: "Salim",
          assigned_to: "",
          status_text: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });

    suite("Testing GET /api/issues/ routes", function () {
      test("GET /api/issues/{project}", function (done) {
        chai
          .request(server)
          .get("/api/issues/test-1")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.lengthOf(res.body, 3);
            done();
          });
      });
      test("GET /api/issues/{project} with one filter", function (done) {
        chai
          .request(server)
          .get("/api/issues/test-1")
          .query({ status_text: "In Qa" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.lengthOf(res.body, 1);
            done();
          });
      });
      test("GET /api/issues/{project} with multiple filters", function (done) {
        chai
          .request(server)
          .get("/api/issues/test-1")
          .query({ status_text: "in Server", created_by: "Salim" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.lengthOf(res.body, 1);
            done();
          });
      });

      suite("Testing PUT /api/issues/{project} routes", function () {
        test("PUT /api/issues/{project} update one field", function (done) {
          chai
            .request(server)
            .put("/api/issues/apitest")
            .set("content-type", "application/json")
            .send({ _id: issueId, issue_title: "Mocha" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, "successfully updated");
              assert.equal(res.body._id, issueId);
              done();
            });
        });
        test("PUT /api/issues/{project} update multiple fields", function (done) {
          chai
            .request(server)
            .put("/api/issues/apitest")
            .set("content-type", "application/json")
            .send({ _id: issueId, issue_title: "Mocha", assigned_to: "Chai" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, "successfully updated");
              assert.equal(res.body._id, issueId);
              done();
            });
        });
        test("PUT /api/issues/{project} update w/ a missing id", function (done) {
          chai
            .request(server)
            .put("/api/issues/apitest")
            .set("content-type", "application/json")
            .send({ issue_title: "Mocha", assigned_to: "Chai" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "missing _id");
              done();
            });
        });
        test("PUT /api/issues/{project} with no fields to update", function (done) {
          chai
            .request(server)
            .put("/api/issues/apitest")
            .set("content-type", "application/json")
            .send({ _id: issueId })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "no update field(s) sent");
              assert.equal(res.body._id, issueId);
              done();
            });
        });
        test("PUT /api/issues/{project} with an invalid id", function (done) {
          chai
            .request(server)
            .put("/api/issues/apitest")
            .set("content-type", "application/json")
            .send({
              _id: "61e44ed24c2ea22fc6ac7210",
              issue_title: "Mocha",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "could not update");
              assert.equal(res.body._id, "61e44ed24c2ea22fc6ac7210");
              done();
            });
        });
      });
      suite("Testing DELETE /api/issues/{project} routes", function () {
        test("DELETE /api/issues/{project} an issue", function (done) {
          chai
            .request(server)
            .delete("/api/issues/apitest")
            .send({
              _id: issueId,
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, "successfully deleted");
              assert.equal(res.body._id, issueId);
              done();
            });
        });
        test("DELETE /api/issues/{project} w/ an invalid id", function (done) {
          chai
            .request(server)
            .delete("/api/issues/apitest")
            .send({
              _id: "61e44ed24c2ea22fc6ac7210",
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "could not delete");
              assert.equal(res.body._id, "61e44ed24c2ea22fc6ac7210");
              done();
            });
        });
        test("DELETE /api/issues/{project} w/ a missing id", function (done) {
          chai
            .request(server)
            .delete("/api/issues/apitest")
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "missing _id");
              done();
            });
        });
      });
    });
  });
});
