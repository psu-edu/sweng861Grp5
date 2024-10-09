import client, { type Channel, type Connection } from "amqplib";
import { rabbit } from "./constants";
import { logger } from "./logger";

type HandlerFn = (event: { event: string; data: any }) => void;

class MQConnection {
	connection!: Connection;
	channel!: Channel;
	private connected = false;

	async connect(retries = 5, delay = 3000) {
		if (this.connected && this.channel) return;

		let attempt = 0;
		while (attempt < retries) {
			try {
				logger.info("Connecting to Rabbit-MQ Server...");
				this.connection = await client.connect(rabbit.connectionString);
				this.channel = await this.connection.createChannel();

				this.connected = true;
				logger.info("✅ Rabbit MQ Connected and channel created successfully");
				return;
			} catch (error) {
				attempt++;
				logger.error("❌ Failed to connect to RabbitMQ, retrying...", error);
				if (attempt >= retries) {
					logger.error("❌ All retries failed. Unable to connect to RabbitMQ.");
					throw error;
				}
				await new Promise((res) => setTimeout(res, delay)); // Wait before retrying
			}
		}
	}

	// Send message to queue
	async sendToQueue(queue: string, message: unknown) {
		try {
			if (!this.channel) {
				await this.connect();
			}

			await this.channel.assertQueue(queue, { durable: true });

			this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
		} catch (error) {
			logger.error("Error sending message to queue:", error);
			throw error;
		}
	}

	// Consume messages from the queue
	async consume(handleIncomingNotification: HandlerFn, queue: string) {
		try {
			if (!this.channel) {
				await this.connect();
			}

			await this.channel.assertQueue(queue, { durable: true });

			this.channel.consume(
				queue,
				(msg) => {
					if (!msg) {
						return logger.error("Invalid incoming message");
					}
					try {
						const content = JSON.parse(msg.content.toString());
						handleIncomingNotification(content);
						this.channel.ack(msg);
					} catch (error) {
						logger.error("Error parsing message content:", error);
					}
				},
				{ noAck: false },
			);
		} catch (error) {
			logger.error("Error consuming messages from queue:", error);
			throw error;
		}
	}
}

const mqConnection = new MQConnection();
export default mqConnection;
