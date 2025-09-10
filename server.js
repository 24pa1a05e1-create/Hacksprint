// Requires Node.js, Express, Twilio
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const app = express();

const accountSid = 'YOUR_TWILIO_SID', authToken = 'YOUR_TWILIO_AUTH';
const client = twilio(accountSid, authToken);

app.use(bodyParser.json());

app.post('/notify', (req, res) => {
  const {phone, message} = req.body;
  client.messages.create({
    body: message,
    from: 'YOUR_TWILIO_PHONE',
    to: phone
  })
  .then(msg => res.status(200).send({sid: msg.sid}))
  .catch(err => res.status(500).send({error: err}));
});

app.listen(3000, ()=>console.log('Server running'));
