const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

// middlewares
const config = require("./config");

// routes
const images = require("./routes/imageRoutes");
const video = require("./routes/mediaRoutes");

const app = express();

const options = {
  origin: "*",
  credentials: true,
};

app.use(cors(options));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

app.use(config.routePrefix + "/images", images);
app.use(config.routePrefix + "/media", video);

app.use("*", (req, res) => {
  res.status(200).end("Api is available.");
});

module.exports = app;
