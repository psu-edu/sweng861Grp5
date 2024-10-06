// MongoDB Seed File
print("Start mongo seed script ##########################");

db = db.getSiblingDB("admin");

db.createUser({
    user: "adminUser",
    pwd: "adminPassword",
    roles: [
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" },
        { role: "dbAdminAnyDatabase", db: "admin" }
    ]
});

db = db.getSiblingDB("users");

db.createUser({
  user: "app_username",
  pwd: "app_password",
    roles: [{ role: "readWrite", db: "users" }],
});

// Users db seed
db.createCollection("users");

db = db.getSiblingDB("leaderboards");

db.createUser({
  user: "app_username",
  pwd: "app_password",
    roles: [{ role: "readWrite", db: "leaderboards" }],
});

// Create 'userEntries' collection
db.createCollection("userEntries");

// Insert example data into userEntries collection
db.userEntries.insertMany([
    { name: "Charlie", score: 120, date: new Date() },
    { name: "David", score: 200, date: new Date() }
]);

print("Leaderboards database created and seeded with example data.");

db.createUser({
  user: "app_username",
  pwd: "app_password",
    roles: [{ role: "readWrite", db: "groups" }],
});

// Groups db seed
db.createCollection("groups");

print("End mongo seed script ##########################");
