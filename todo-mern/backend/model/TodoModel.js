const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    pending: {
        type: String,
        required: true,
        default: Date.now() + 86400000
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Todo', TodoSchema);