const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Conversations = require('../models/Conversations');
const Users = require('../models/Users');
const { check, validationResult } = require('express-validator');
require('dotenv').config()


router.post('/',
    [
        check('senderId', 'senderId is required').exists(),
        check('receiverId', 'receiverId include a valid email').exists(),
    ], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() });
            }

            if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
                return res.status(400).json({ error: 'Invalid Id' });
            }
    

            const { senderId, receiverId } = req.body;
            const newCoversation = new Conversations({ members: [senderId, receiverId] });
            await newCoversation.save();
            res.status(200).json({ message: 'Conversation created successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        const conversations = await Conversations.find({ members: { $in: [userId] } });

        if (!conversations || conversations.length === 0) {
            return res.status(404).json({ message: 'No conversations found for the user' });
        }

        const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await Users.findById(receiverId);
            return { user: { receiverId: user._id, email: user.email, fullName: user.fullName }, conversationId: conversation._id }
        }))
        res.status(200).json(conversationUserData);
    } catch (error) {
        console.log(error, 'Error')
        res.status(500).json({ error: err.message });
    }
})
module.exports = router;