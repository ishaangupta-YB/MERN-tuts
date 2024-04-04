const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { check, validationResult } = require('express-validator');
require('dotenv').config()


router.post('/register',
    [   
        check('fullName', 'Name is required').exists(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ], async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        const { fullName, email, password } = req.body;
        
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new User({ fullName: fullName, email: email, password: hashedPassword });
            await newUser.save(); 

            const payload = {
                user: {
                    userId: newUser._id,
                    email: newUser.email
                }
            };

            jwt.sign(payload, process.env.JWT_SECRET || 'SECRET', { expiresIn: 3600 }, async (err, token) => {
                if (err) throw err;
                await User.updateOne({ _id: newUser._id }, {
                    $set: { token }
                })
                newUser.save();
                return res.status(200).json({ user: { id: newUser._id, email: newUser.email, fullName: newUser.fullName }, token: token });
            }); 
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


router.post('/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ], async (req, res) => {

        const { email, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            const payload = {
                user: {
                    userId: user._id,
                    email: user.email
                }
            };

            jwt.sign(payload, process.env.JWT_SECRET || 'SECRET', { expiresIn: 3600 }, async (err, token) => {
                if (err) throw err;
                await User.updateOne({ _id: user._id }, {
                    $set: { token }
                })
                user.save();
                return res.status(200).json({ user: { id: user._id, email: user.email, fullName: user.fullName }, token: token });
            });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }); 

module.exports = router;