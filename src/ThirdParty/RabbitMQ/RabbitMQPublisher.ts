import { connect, Channel, Connection } from 'amqplib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMQ {
  private readonly amqpUrl: string;
  private readonly exchangeName: string;
  private readonly exchangeType: string;

  constructor(amqpUrl: string, exchangeName: string, exchangeType = 'fanout') {
    this.amqpUrl = amqpUrl;
    this.exchangeName = exchangeName;
    this.exchangeType = exchangeType;
  }

  async publish(message: any): Promise<void> {
    try {
      const connection: Connection = await connect(this.amqpUrl);
      const channel: Channel = await connection.createChannel();

      await channel.assertExchange(this.exchangeName, this.exchangeType, {
        durable: false,
        autoDelete: true,
      });

      await channel.publish(
        this.exchangeName,
        '',
        Buffer.from(JSON.stringify(message)),
        { expiration: '10000' }, // TTL 10s
      );

      // console.log(`Sent message => ${message}`);

      await channel.close();
      await connection.close();
    } catch (error) {
      console.error(error);
    }
  }
}
