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
  connectionString:
    `mongodb://${USER}:${PASS}@${HOST}:${PORT}/${NAME}?authSource=${NAME}`,
};
