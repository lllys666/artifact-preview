const express = require("express");
const { Octokit } = require("@octokit/core");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

app.use(express.text());

app.post("/download", (req, res) => {
  const artifactId = Number(req.body);
  res.send(`www.test.com/download/${artifactId}`);
});

app.listen(3000, () => console.log("Listening on port 3000!"));
