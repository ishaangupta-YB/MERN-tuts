const express = require('express');
const router = express.Router();
const Todo = require('../model/TodoModel');

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { title, description, pending, completed } = req.body;

    const newTodo = new Todo({
        title,
        description,
        pending,
        completed,
    });

    try {
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    const { title, description, pending, completed } = req.body;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description, pending, completed },
            { new: true }
        );
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;