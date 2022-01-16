"use strict";
const { ObjectId } = require("mongodb");

module.exports = function (app, database) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;

      if (req.query.open) {
        req.query.open = JSON.parse(req.query.open);
      }

      if (req.query._id) {
        req.query._id = new ObjectId(req.query._id);
      }

      const cursor = database.collection(project).find(req.query);
      cursor
        .toArray()
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.send("Something is going wrong...");
        });
    })

    .post(function (req, res) {
      let project = req.params.project;

      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      const issue = {
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        status_text: status_text || "",
        open: true,
        created_on: new Date(),
        updated_on: new Date(),
      };

      database.collection(project).insertOne(issue, (err, doc) => {
        if (err) {
          return res.send("Something went wrong");
        }
        res.json(issue);
      });
    })

    .put(function (req, res) {
      let project = req.params.project;

      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text
      ) {
        return res.json({ error: "no update field(s) sent", _id: _id });
      }

      if (req.body.open) {
        req.body.open = JSON.parse(req.body.open);
      }

      let update = {};

      Object.entries(req.body).forEach((item) => {
        if (item[0] !== "_id") {
          let key = item[0].toString();
          update[key] = item[1];
        }
      });

      database.collection(project).updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: update,
          $currentDate: {
            updated_on: true,
          },
        },
        (err, result) => {
          if (err || !result.modifiedCount) {
            return res.json({ error: "could not update", _id: _id });
          }
          return res.json({ result: "successfully updated", _id: _id });
        }
      );
    })

    .delete(function (req, res) {
      let project = req.params.project;

      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      database
        .collection(project)
        .deleteOne({ _id: new ObjectId(_id) }, (err, result) => {
          if (err || !result.deletedCount) {
            return res.json({ error: "could not delete", _id: _id });
          }
          return res.json({ result: "successfully deleted", _id: _id });
        });
    });
};
