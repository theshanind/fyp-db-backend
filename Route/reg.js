const express = require('express');
const bcrypt = require('bcryptjs');

const dbcollaction = require("../config/user");

const router = express.Router();

// REGISTER
router.post('/register', (req, res) => {
    const { name, email, username, password } = req.body;

    // ✅ Backend validation
    if (!name || !email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    bcrypt.hash(password, 10)
        .then(hash => {
            dbcollaction.create({ name, email, username, password: hash })
                .then(user => res.json('Successful'))
                .catch(err => res.status(400).json({ message: 'Register fail', error: err.message }))
        })
        .catch(error => res.status(500).json({ message: 'Server error', error: error.message }))
});

module.exports = router;