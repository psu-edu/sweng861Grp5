// MongoDB Seed File
print("Start mongo seed script ##########################");

db = db.getSiblingDB("bitfit");

db.createUser({
  user: process.env.APP_USER,
  pwd: process.env.APP_PASS,
  roles: [{ role: "readWrite", db: "bitfit" }],
});

// Users db seed
db.createCollection("users");
db.createCollection("groups");
db.createCollection("leaderboards");
db.createCollection("goals");

print("End mongo seed script ##########################");
