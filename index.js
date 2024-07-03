const express = require('express');
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl);
    next();
});

const sender_email = process.env.EMAIL;
const sender_password = process.env.EMAIL_APP_PASS;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: sender_email,
        pass: sender_password,
    },
});

app.post('/send-whatsapp', async (req, res) => {
    const { message } = req.body;
    const info = await transporter.sendMail({
        from: sender_email,
        to: "knightownr@gmail.com", 
        subject: "Subscription Reminder", 
        html: message, 
    });
    res.send({ success: true, data: info });
});

// Serve HTML files for each route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add.html'));
});

app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'list.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
