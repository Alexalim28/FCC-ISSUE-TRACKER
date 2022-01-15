const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  status_text: String,
  assigned_to: String,
  open: {
    type: Boolean,
    default: true,
  },
  created_on: { type: Date, default: new Date() },
  updated_on: { type: Date, default: new Date() },
});

const Issue = mongoose.model("issue", issueSchema);

const projectSchema = new mongoose.Schema({
  name: String,
  projectIssues: [issueSchema],
});

const ProjectIssue = mongoose.model("project", projectSchema);

module.exports = { Issue, ProjectIssue };
