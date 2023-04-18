const express = require('express');
const morgan = require('morgan');
import { RabbitMQ } from './ThirdParty/RabbitMQ/RabbitMQPublisher';
import { ConfigService } from '@nestjs/config';

const app = express();
const port = 8081;
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));

// const configService = new ConfigService();
// const amqpUrl = configService.get<string>('amqpUrl');
// const exNameLiveMatch = configService.get<string>('exNameLiveMatch');
// const exNamePreMatch = configService.get<string>('exNamePreMatch');
// const exchangeType = configService.get<string>('exTypeFanout');
const rabbitMQ1Live = new RabbitMQ('amqp://user_broker:sanbul123@103.31.12.63:5672/dataGamev1', 'dataLiveMatch', 'fanout');
const rabbitMQPre = new RabbitMQ('amqp://user_broker:sanbul123@103.31.12.63:5672/dataGamev1', 'dataPreMatch', 'fanout');

app.post('/LivematchGame/endpoints', async (req, res) => {
  try {
    const contentLength = req.headers['content-length'] / 1024;
    console.log(`body size: ${contentLength.toFixed(2)} kb`);
    rabbitMQ1Live.publish(req.body);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error });
  }
});

app.post('/PrematchGame/endpoints', async (req, res) => {
  try {
    const contentLength = req.headers['content-length'] / 1024;
    console.log(`body size: ${contentLength.toFixed(2)} kb`);
    rabbitMQPre.publish(req.body);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error });
  }
});

app.listen(port, () => {
  console.log(`Server port ${port}`);
});
