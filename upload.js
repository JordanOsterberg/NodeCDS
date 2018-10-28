const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public/" })

const app = express();
const instanceId = parseInt(process.env.NODE_APP_INSTANCE || 0);
const port = (parseInt(process.env.PORT === undefined ? 4000 : process.env.PORT) + instanceId);

const deliveryURL = process.env.URL || "http://localhost:3000";

app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
});

app.post("/upload", upload.single("file"), (req, res) => {
    // USE SOME FORM OF AUTHENTICATION SERVER OR CHECK TO ENSURE THAT THIS USER SHOULD BE UPLOADING FILES TO THE CDS

    if (req.file === undefined) {
        res.status(400).json({error: "No file attached. A file with the name 'file' must be attached to this request."});
        return;
    }

    const file = req.file;
    const mimetype = file.mimetype;

    // Image
    if (mimetype === "image/png" || mimetype === "image/jpeg") {
        const extension = mimetype === "image/png" ? ".png" : ".jpg";

        fs.rename(file.path, __dirname + "/public/image/" + file.filename + extension, (error) => {
            if (error) {
                res.status(500).json({error: "Failed to save file. Try again later"});
            } else {
                // Here is where you would save the URL into a database somewhere
                res.status(200).json({url: deliveryURL + "/image/" + file.filename + extension});
            }
        })
    } else if (mimetype === "video/mp4") {
        const extension = ".mp4";

        fs.rename(file.path, __dirname + "/public/video/" + file.filename + extension, (error) => {
            if (error) {
                res.status(500).json({error: "Failed to save file. Try again later"});
            } else {
                // Here is where you would save the URL into a database somewhere
                res.status(200).json({url: deliveryURL + "/video/" + file.filename});
            }
        })
    } else {
        res.status(400).json({error: "Invalid file type " + mimetype});
    }
});

app.listen(port, () => console.log("[NodeCDN/upload (" + instanceId + ")] Began listening on port " + port));
