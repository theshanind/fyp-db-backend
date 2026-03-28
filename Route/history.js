const express = require('express');
const router = express.Router();
const History = require('../Config/history');

// POST /api/history/save — called from frontend after each analysis
router.post('/save', async (req, res) => {
    const { userId, modelType, uploadedImage, annotatedImage,
            prediction, confidence, extraData } = req.body;

    if (!userId || !modelType || !uploadedImage || !annotatedImage
        || !prediction || confidence == null) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const record = await History.create({
            userId, modelType, uploadedImage, annotatedImage,
            prediction, confidence, extraData: extraData || {}
        });
        res.status(201).json({ message: 'Saved', id: record._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/history/:userId — fetch all history for a user
router.get('/:userId', async (req, res) => {
    try {
        const records = await History.find({ userId: req.params.userId })
            .sort({ createdAt: -1 }) // newest first
            .select('-uploadedImage -annotatedImage'); // exclude heavy base64 for list view
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/history/detail/:id — fetch single record with images
router.get('/detail/:id', async (req, res) => {
    try {
        const record = await History.findById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Not found' });
        res.json(record);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});
// ── DELETE /api/history/:id ───────────────────────────────────────────────
// Delete a single history record
router.delete('/:id', async (req, res) => {
    try {
        await History.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});
module.exports = router;