const Media = require("../db/models/mediaModel");
const cloudinary = require("../config/cloudinary");

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const resourceType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image";
    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: resourceType,
    });

    const newMedia = new Media({
      url: cldRes.secure_url,
      public_id: cldRes.public_id,
      title: req.body.title,
      description: req.body.description,
      type: resourceType,
    });
    await newMedia.save(); // Save to MongoDB

    res.json(cldRes);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMedia = async (req, res) => {
  try {
    const media = await Media.find();
    res.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ message: error.message });
  }
};

// Implement delete and update media as needed
const deleteMedia = async (req, res) => {
  const { public_id } = req.params;
  try {
    await cloudinary.uploader.destroy(public_id);
    const result = await Media.deleteOne({ public_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Media not found." });
    }
    res.json({ message: "Media deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateMedia = async (req, res) => {
  const { public_id } = req.params;
  const { title, description } = req.body;
  const newFile = req.file;

  try {
    let updatedMedia = { title, description };

    if (newFile) {
      const b64 = Buffer.from(newFile.buffer).toString("base64");
      const dataURI = `data:${newFile.mimetype};base64,${b64}`;
      const resourceType = newFile.mimetype.startsWith("video")
        ? "video"
        : "image";
      const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
        resource_type: resourceType,
      });

      await cloudinary.uploader.destroy(public_id); // Remove old media
      updatedMedia = {
        ...updatedMedia,
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
        type: resourceType,
      };
    }

    const updatedMediaDoc = await Media.findOneAndUpdate(
      { public_id },
      updatedMedia,
      { new: true }
    );

    if (!updatedMediaDoc) {
      return res.status(404).json({ message: "Media not found." });
    }

    res.json(updatedMediaDoc);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia,
  updateMedia,
};
