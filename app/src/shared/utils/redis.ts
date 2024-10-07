import { type RedisClientType, createClient } from "redis";
import { redisCache } from "./constants";
import { logger } from "./logger";

class Cache {
	private static instance: Cache;
	private client: RedisClientType;

	// Private constructor to ensure only one instance
	private constructor() {
		this.client = createClient({
			url: redisCache.connectionString,
		});

		// Handle Redis errors
		this.client.on("error", (err) => {
			logger.error("Redis error:", err);
		});

		// Connect to Redis
		this.client.connect().catch((err) => {
			logger.error("Error connecting to Redis:", err);
		});
	}

	// Singleton pattern to ensure a single Redis connection
	public static getInstance(): Cache {
		if (!Cache.instance) {
			Cache.instance = new Cache();
		}
		return Cache.instance;
	}

	// Set value with optional expiration time (in seconds)
	public async set(
		key: string,
		value: string,
		expirationInSeconds?: number,
	): Promise<void> {
		await this.client.set(key, value);
		if (expirationInSeconds) {
			await this.client.expire(key, expirationInSeconds);
		}
	}

	// Get value from Redis
	public async get(key: string): Promise<string | null> {
		return await this.client.get(key);
	}

	// Delete value from Redis
	public async del(key: string): Promise<void> {
		await this.client.del(key);
	}

	// Set expiration time for a key
	public async expire(key: string, expirationInSeconds: number): Promise<void> {
		await this.client.expire(key, expirationInSeconds);
	}
}

export default Cache;
