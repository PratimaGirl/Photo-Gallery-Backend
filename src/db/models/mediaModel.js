const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    url: String,
    public_id: String,
    title: String,
    description: String,
    type: String, // "image" or "video"
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;
