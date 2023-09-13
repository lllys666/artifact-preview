const express = require("express");
const { Octokit } = require("@octokit/core");
const fs = require("fs");
const path = require("path");
const decompress = require("decompress");
require("dotenv").config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER = process.env.OWNER;
const REPO = process.env.REPO;

const app = express();
app.use(express.text());

app.post("/download", async (req, res) => {
  const artifactId = req.body;
  console.log(`[INFO] START of this Artifact: ${artifactId}`);
  // download artifact using github api
  try {
    const response = await octokit.request(
      `GET /repos/${OWNER}/${REPO}/actions/artifacts/${artifactId}/zip`,
      {
        owner: OWNER,
        repo: REPO,
        artifact_id: artifactId,
        archive_format: "zip",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    console.log(`[INFO] Artifact downloaded`);

    // check if there is a "download" directory, if not then create one
    if (!fs.existsSync("download")) {
      fs.mkdirSync("download");
    }

    // save downloaded zipped artifact to path "./download/"
    const zipPath = path.join(__dirname, "download", `${artifactId}.zip`);
    fs.writeFileSync(zipPath, Buffer.from(response.data));
    console.log(`[INFO] Saved Artifact to \`download\` directory`);

    // unzip the artifact
    const dirPath = path.join(__dirname, "download", artifactId);
    decompress(zipPath, dirPath)
      .then(() => {
        console.log("[INFO] ZIP file extracted successfully.");
        // delete the zip file
        fs.unlinkSync(zipPath);
      })
      .catch((error) => {
        console.log("[ERROR] ZIP file failed to extract:", error);
        throw error;
      });

    res.send({ url: `https://${process.env.DOMAIN}/download/${artifactId}` });
  } catch (error) {
    if (error.response !== undefined) {
      console.log("[ERROR] Github Error");
      res.status(503).send(error.response.data);
    } else {
      console.log("[ERROR] Script Error");
      res.status(503).send(error.message);
    }
  }
});

app.get("/download/:id", function (req, res, next) {
  // Get the artifact id from the URL parameter
  const artifactId = req.params.id;

  const dirPath = path.join(__dirname, "download", artifactId);

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).send("Internal Server Error");
    }

    // Check if there is exactly one file in the directory
    if (files.length !== 1) {
      return res.status(404).send("No file found or multiple files found");
    }

    const fileName = files[0]; // Get the name of the file
  });

  // Construct the full file path
  const filePath = path.join(
    __dirname,
    "download",
    artifactId,
    "oi-wiki-export.pdf"
  );

  // Use res.download to serve the file for download
  res.download(filePath, (err) => {
    if (err) {
      // Handle errors, e.g., file not found
      res.status(404).send("File not found");
    }
  });
});

app.listen(3000, () => console.log("Listening on port 3000!"));
