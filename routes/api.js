"use strict";
const { ObjectId } = require("mongodb");
const { Issue, ProjectIssue } = require("../models");

module.exports = function (app, database) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;

      const agg = [
        {
          $match: {
            name: project,
          },
        },
        {
          $unwind: {
            path: "$projectIssues",
          },
        },
        {
          $match: {
            "projectIssues.assigned_to": "Alex",
          },
        },
      ];

      database
        .aggregate(agg)
        .toArray()
        .then((result) => res.json(result));
    })

    .post(function (req, res) {
      let project = req.params.project;

      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      const issue = {
        _id: ObjectId(),
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        status_text: status_text || "",
        open: true,
        created_on: new Date(),
        updated_on: new Date(),
      };

      database.findOne({ name: project }, (err, doc) => {
        if (!doc) {
          database.insertOne({
            name: project,
            projectIssues: [issue],
          });
        } else {
          database.updateOne(
            { name: project },
            {
              $push: { projectIssues: issue },
            }
          );
        }
        res.json(issue);
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
