const express = require('express');
const bcrypt = require('bcryptjs');

const dbcollaction = require("../config/user");

const router = express.Router();


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Check if user exists
        const user = await dbcollaction.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // 3. Return user data directly
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = router;