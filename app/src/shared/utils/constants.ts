const USER = process.env.APP_USER;
const PASS = process.env.APP_PASS;
const NAME = process.env.MONGO_INITDB_DATABASE;
const HOST = process.env.DB_HOST || "localhost";
const PORT = process.env.DB_PORT || "27017";

export const mongo = {
	NAME,
	PASS,
	USER,
	HOST,
	PORT,
	connectionString: `mongodb://${USER}:${PASS}@${HOST}:${PORT}/${NAME}?authSource=${NAME}`,
};

const RMQ_USER = process.env.RABBITMQ_DEFAULT_USER;
const RMQ_PASS = process.env.RABBITMQ_DEFAULT_PASS;
const RMQ_HOST = process.env.RABBITMQ_HOST || "localhost";
const RMQ_PORT = process.env.RABBITMQ_PORT || "5672";

export const rabbit = {
	USER: RMQ_USER,
	PASS: RMQ_PASS,
	HOST: RMQ_HOST,
	PORT: RMQ_PORT,
	connectionString: `amqp://${RMQ_USER}:${RMQ_PASS}@${RMQ_HOST}:${RMQ_PORT}`,
};

const RD_HOST = process.env.REDIS_HOST || "localhost";
const RD_PORT = process.env.REDIS_PORT || "";

export const redisCache = {
	HOST: RD_HOST,
	PORT: RD_PORT,
	connectionString: `redis://${RD_HOST}:${RD_PORT}`,
};

const APP_PORT = process.env.PORT || 8080;

export const application = {
	PORT: APP_PORT,
};
