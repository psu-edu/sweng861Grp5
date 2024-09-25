import client, { type Channel, type Connection } from "amqplib";
import { logger } from "./logger";

type HandlerFn = (msg: string) => unknown;

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

		const RMQ_USER = this.user;
		const RMQ_PASS = this.pass;
		const RMQ_HOST = process.env.RMQ_HOST;

		try {
			logger.info("⌛️ Connecting to Rabbit-MQ Server");
			this.connection = await client.connect(
				`amqp://${RMQ_USER}:${RMQ_PASS}@${RMQ_HOST}:5672`,
			);

			logger.info("✅ Rabbit MQ Connected");

			this.channel = await this.connection.createChannel();

			logger.info("✅ Created RabbitMQ Channel successfully");
		} catch (error) {
			logger.error(error);
			logger.error("❌ Not connected to MQ Server");
		}
	}
	async sendToQueue(queue: string, message: unknown) {
		try {
			if (!this.channel) {
				await this.connect();
			}

			this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async consume(handleIncomingNotification: HandlerFn, queue: string) {
		await this.channel.assertQueue(queue, {
			durable: true,
		});

		this.channel.consume(
			queue,
			(msg) => {
				if (!msg) {
					return logger.error("Invalid incoming message");
				}
				handleIncomingNotification(msg?.content?.toString());
				this.channel.ack(msg);
			},
			{
				noAck: false,
			},
		);
	}
}

const mqConnection = new MQConnection();

export default mqConnection;
