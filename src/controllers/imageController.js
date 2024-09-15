// src/controllers/imageController.js
const Image = require("../db/models/imageModel");
const cloudinary = require("../config/cloudinary");

// Upload image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });

    const newImage = new Image({
      url: cldRes.secure_url,
      public_id: cldRes.public_id,
      title: req.body.title,
      description: req.body.description,
    });
    await newImage.save();

    res.json(cldRes);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Fetch images
const getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  const { public_id } = req.params;
  try {
    await cloudinary.uploader.destroy(public_id);
    const result = await Image.deleteOne({ public_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Image not found." });
    }
    res.json({ message: "Image deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update image
const updateImage = async (req, res) => {
  const { public_id } = req.params;
  const { title, description } = req.body;
  const newFile = req.file;

  try {
    let updatedImage = { title, description };

    if (newFile) {
      const b64 = Buffer.from(newFile.buffer).toString("base64");
      const dataURI = `data:${newFile.mimetype};base64,${b64}`;
      const cloudinaryResponse = await cloudinary.uploader.upload(dataURI);

      await cloudinary.uploader.destroy(public_id); // Remove old image
      updatedImage = {
        ...updatedImage,
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      };
    }

    const updatedImageDoc = await Image.findOneAndUpdate(
      { public_id },
      updatedImage,
      { new: true }
    );

    if (!updatedImageDoc) {
      return res.status(404).json({ message: "Image not found." });
    }

    res.json(updatedImageDoc);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadImage,
  getImages,
  deleteImage,
  updateImage,
};
