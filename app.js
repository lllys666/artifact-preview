const express = require("express");
const { Octokit } = require("@octokit/core");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
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
    // fs.mkdirSync(dirPath);
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: dirPath }))
      .on("error", (err) => {
        console.error("[ERROR] Error unzipping the file:", err);
        throw new Error("Zip file corrupted");
      })
      .on("finish", () => {
        console.log("[INFO] ZIP file extracted successfully.");
        // Delete the zip file
        fs.unlinkSync(zipPath);
      });

    res.send({ url: `domain.com/download/${artifactId}` });
  } catch (error) {
    if (error.response !== undefined) {
      res.status(503).send(error.response.data);
    } else {
      res.status(503).send(error.message);
    }
  }
  console.log(`[INFO] END of this Artifact: ${artifactId}`);
});

app.listen(3000, () => console.log("Listening on port 3000!"));
