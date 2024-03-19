const express = require('express');
const router = express.Router();
const Todo = require('../model/TodoModel');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    const { title, description, pending, completed } = req.body;
    const newTodo = new Todo({
        user: req.user.id,
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


router.put('/:id', auth, async (req, res) => {
    const { title, description, pending, completed } = req.body;
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        if (todo.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        todo.title = req.body.title;
        todo.description = req.body.description;
        todo.pendingDate = req.body.pendingDate;
        todo.completed = req.body.completed;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id',auth, async (req, res) => {
    console.log(req.params.id)
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;