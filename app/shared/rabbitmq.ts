import client, { Channel, Connection } from "amqplib";

type HandlerFn = (msg: string) => any;

class MQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected!: boolean;
  user: string | undefined = process.env.RABBITMQ_DEFAULT_USER;
  pass: string | undefined = process.env.RABBITMQ_DEFAULT_PASS;

  constructor(user?: string, pass?: string) {
    if (user !== undefined) {
      this.user = user;
    }

    if (pass !== undefined) {
      this.pass = pass;
    }
  }

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    const RMQ_USER = this.user;
    const RMQ_PASS = this.pass;
    const RMQ_HOST = process.env.RMQ_HOST;

    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`);
      this.connection = await client.connect(`amqp://${RMQ_USER}:${RMQ_PASS}@${RMQ_HOST}:5672`);

      console.log(`✅ Rabbit MQ Connected`);

      this.channel = await this.connection.createChannel();

      console.log(`✅ Created RabbitMQ Channel successfully`);
    } catch (error) {
      console.error(error);
      console.error(`❌ Not connected to MQ Server`);
    }
  }
  async sendToQueue(queue: string, message: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async consume(handleIncomingNotification: HandlerFn, queue: string) {
    await this.channel.assertQueue(queue, {
      durable: true
    });

    this.channel.consume(
      queue,
      (msg: any) => {
        {
          if (!msg) {
            return console.error(`Invalid incoming message`);
          }
          handleIncomingNotification(msg?.content?.toString());
          this.channel.ack(msg);
        }
      },
      {
        noAck: false
      }
    );
  }
}

const mqConnection = new MQConnection();

export default mqConnection;
