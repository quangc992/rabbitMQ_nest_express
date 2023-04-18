const express = require('express');
const morgan = require('morgan');
import { RabbitMQ } from './ThirdParty/RabbitMQ/RabbitMQPublisher';

const app = express();
const port = 8081;
// app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));

const rabbitMQ1Live = new RabbitMQ('amqp://user_broker:sanbul123@103.31.12.63:5672/dataGamev1', 'dataLiveMatch', 'fanout');
const rabbitMQPre = new RabbitMQ('amqp://user_broker:sanbul123@103.31.12.63:5672/dataGamev1', 'dataPreMatch', 'fanout');

app.get('/LivematchGame/endpoints', async (req, res) => {
  try {
    res.json({ success: true, api: 'sanbul : API live data match' });
  } catch (error) {
    res.json({ success: false, error });
  }
});

app.post('/PrematchGame/endpoints', async (req, res) => {
  try {
    const startTime = performance.now();
    const contentLength = req.headers['content-length'] / 1024;
    console.log(`body size: ${contentLength.toFixed(2)} kb`);
    rabbitMQ1Live.publish(req.body);
    console.log(performance.now() - startTime)
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error });
  }
});

app.post('/PrematchGame/endpoints', async (req, res) => {
  try {
    const startTime = performance.now();
    const contentLength = req.headers['content-length'] / 1024;
    console.log(`body size: ${contentLength.toFixed(2)} kb`);
    rabbitMQPre.publish(req.body);
    console.log(performance.now() - startTime)
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error });
  }
});

app.listen(port, () => {
  console.log(`Server port ${port}`);
});
