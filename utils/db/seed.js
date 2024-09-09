// MongoDB Seed File
print("Start mongo seed script ##########################");

db = db.getSiblingDB("users");
// Users db seed
db.createCollection("users");

db = db.getSiblingDB("leaderboards");
// Leaderboards db seed
db.createCollection("leaderboards");

db = db.getSiblingDB("groups");
// Groups db seed
db.createCollection("groups");

print("End mongo seed script ##########################");
