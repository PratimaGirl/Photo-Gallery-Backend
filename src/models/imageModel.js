const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    url: String,
    public_id: String,
    title: String,
    description: String,
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

// Export the Image model
const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
