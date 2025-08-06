const express = require('express');
var cors = require('cors');
const connectDB = require('./connection');
const appuserRoute = require('./routes/appuser');
const categoryRoute = require('./routes/category');
const articleRoute = require('./routes/article');
const chatRoute = require('./routes/chat');
const studentRoute = require('./routes/student');
const branchRoute= require('./routes/branch');
const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use('/appuser', appuserRoute);
app.use('/category', categoryRoute);
app.use('/article', articleRoute);
app.use('/chat', chatRoute);
app.use('/student', studentRoute);
app.use('/branch', branchRoute);

module.exports = app;