// src/routes/imageRoutes.js
const express = require("express");
const multer = require("multer");
const { uploadImage, getImages, deleteImage, updateImage } = require("../controllers/imageController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("my_file"), uploadImage);
router.get("/images", getImages);
router.delete("/images/:public_id", deleteImage);
router.put("/images/:public_id", upload.single("my_file"), updateImage);

module.exports = router;

