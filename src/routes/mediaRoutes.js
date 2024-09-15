const express = require("express");
const multer = require("multer");
const { uploadMedia, getMedia, deleteMedia, updateMedia } = require("../controllers/mediaController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("my_file"), uploadMedia);
router.get("/", getMedia); // Ensure this route exists and is correctly used in your frontend
router.delete("/:public_id", deleteMedia);
router.put("/:public_id", upload.single("my_file"), updateMedia);
router.get("*", (_, res) => res.end("Media routes are available"));
module.exports = router;
