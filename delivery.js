const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const instanceId = parseInt(process.env.NODE_APP_INSTANCE || 0);
const port = (parseInt(process.env.PORT === undefined ? 3000 : process.env.PORT) + instanceId);

app.get("/video/:name", (req, res) => {
    console.log("[NodeCDN/delivery (" + instanceId + ")] /video/" + req.params.name);

    // THIS IS NOT VIABLE OR SECURE IN PRODUCTION.
    // A DATABASE SHOULD BE CONSULTED BEFORE ATTEMPTING TO USE THE FILESYSTEM
    // DO NOT, EVER, USE THIS IN PRODUCTION WITHOUT MORE SAFETY
    const videoPath = "public/video/" + req.params.name + ".mp4"

    if (!fs.existsSync(videoPath)) {
        res.status(404).json({error: "Video doesn't exist."})
        return;
    }

    const stat = fs.statSync(videoPath)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      const file = fs.createReadStream(videoPath, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(videoPath).pipe(res)
    }
});

app.use("/image", express.static("public/image"));
app.listen(port, () => console.log("[NodeCDN/delivery (" + instanceId + ")] Began listening on port " + port));
