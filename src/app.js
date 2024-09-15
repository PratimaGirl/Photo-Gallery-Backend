// src/app.js
const express = require("express");
const cors = require("cors");
const imageRoutes = require("./routes/imageRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const app = express();
app.use(cors());
app.use(express.json()); // Middleware for JSON requests

// Routes
app.use("/", imageRoutes);
app.use("/media", mediaRoutes);

module.exports = app;
