// src/routes/imageRoutes.js
const express = require("express");
const multer = require("multer");
const {
  uploadImage,
  getImages,
  deleteImage,
  updateImage,
} = require("../controllers/imageController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("my_file"), uploadImage);
router.get("/", getImages);
router.delete("/:public_id", deleteImage);
router.put("/:public_id", upload.single("my_file"), updateImage);
router.get("*", (_, res) => res.end("Image routes are available"));
module.exports = router;
