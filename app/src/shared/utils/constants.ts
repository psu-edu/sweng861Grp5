const USER = process.env.APP_USER;
const PASS = process.env.APP_PASS;
const NAME = process.env.MONGO_INITDB_DATABASE;
const HOST = process.env.DB_HOST || "localhost";
const PORT = process.env.DB_PORT || "27017";

// Individual database names
const USERS_DB = "users";
const LEADERBOARDS_DB = "leaderboards";
const GROUPS_DB = "groups";

// Export connection strings for each database
export const mongo = {
    USER,
    PASS,
    HOST,
    PORT,
    usersConnectionString: `mongodb://${USER}:${PASS}@${HOST}:${PORT}/${USERS_DB}?authSource=admin`,
    leaderboardsConnectionString: `mongodb://${USER}:${PASS}@${HOST}:${PORT}/${LEADERBOARDS_DB}?authSource=admin`,
    groupsConnectionString: `mongodb://${USER}:${PASS}@${HOST}:${PORT}/${GROUPS_DB}?authSource=admin`,
};
