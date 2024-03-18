const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db/conn')
const todoRoutes = require('./routes/todo');


connectDB()
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});