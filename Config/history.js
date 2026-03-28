const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userdetails', required: true },
    modelType: { type: String, enum: ['yolo', 'classification'], required: true },
    uploadedImage: { type: String, required: true },  // base64 of original image
    annotatedImage: { type: String, required: true }, // base64 from model
    prediction: { type: String, required: true },     // top class/grade name
    confidence: { type: Number, required: true },     // e.g. 94.2
    extraData: { type: Object, default: {} },         // summary / tier / top3 etc.
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('analysishistory', historySchema);