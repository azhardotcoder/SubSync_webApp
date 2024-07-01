require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const accountSid = process.env.ACCOUNTS_ID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);

app.post('/send-whatsapp', (req, res) => {
    const { message, to } = req.body;

    client.messages
        .create({
            body: message,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${to}`,
        })
        .then(message => {
            res.status(200).send({ success: true, messageSid: message.sid });
        })
        .catch(error => {
            res.status(500).send({ success: false, error: error.message });
        });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
