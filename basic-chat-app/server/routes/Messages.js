const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Conversations = require('../models/Conversations');
const Messages = require('../models/Messages');
const Users = require('../models/Users');
const { check, validationResult } = require('express-validator');
require('dotenv').config()


router.post('/',
    [
        check('senderId', 'senderId is required').exists(),
        check('receiverId', 'receiverId is required').exists(),
        check('conversationId', 'conversationId is required').exists(),
        check('message', 'message is required').exists(),
    ], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() });
            }
            const { conversationId, senderId, message, receiverId = '' } = req.body;

            if (!message || !mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
                return res.status(400).json({ error: 'invalid or Empty Fields' });
            }

            if (conversationId === 'new' && receiverId) {
                const newCoversation = new Conversations({ members: [senderId, receiverId] });
                await newCoversation.save();
                const newMessage = new Messages({ conversationId: newCoversation._id, senderId, message });
                await newMessage.save();
                return res.status(200).json({ message: 'Message sent successfully' });

            } 

            const newMessage = new Messages({ conversationId, senderId, message });
            await newMessage.save();
            res.status(200).json({ message: 'Message sent successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


router.get('/:conversationId', async (req, res) => {
    try {
        const checkMessages = async (conversationId) => {
            const messages = await Messages.find({ conversationId });
            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await Users.findById(message.senderId);
                return { user: { id: user._id, email: user.email, fullName: user.fullName }, message: message.message }
            }));
            res.status(200).json({ message: await messageUserData });
        }
        const conversationId = req.params.conversationId;
        const senderId= req.query.senderId
        const receiverId= req.query.receiverId

        if (!conversationId || !mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ error: 'invalid or Empty Fields' });
        }

        if (conversationId === 'new') {
            const checkConversation = await Conversations.find({ members: { $all: [senderId, receiverId] } });
            if (checkConversation.length > 0) {
                checkMessages(checkConversation[0]._id);
            } else {
                return res.status(200).json([])
            }
        } else {
            checkMessages(conversationId);
        }
    } catch (error) {
        console.log('Error', error)
    }
})

module.exports = router;