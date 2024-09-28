// MongoDB Seed File
print("Start mongo seed script ##########################");

db = db.getSiblingDB("users");

db.createUser({
  user: "app_username",
  pwd: "app_password",
  roles: [{ role: "readWrite", db: "special_day" }],
});

// Users db seed
db.createCollection("users");

db = db.getSiblingDB("leaderboards");

db.createUser({
  user: "app_username",
  pwd: "app_password",
  roles: [{ role: "readWrite", db: "special_day" }],
});

// Leaderboards db seed
db.createCollection("leaderboards");

db = db.getSiblingDB("groups");

db.createUser({
  user: "app_username",
  pwd: "app_password",
  roles: [{ role: "readWrite", db: "special_day" }],
});

// Groups db seed
db.createCollection("groups");

print("End mongo seed script ##########################");
