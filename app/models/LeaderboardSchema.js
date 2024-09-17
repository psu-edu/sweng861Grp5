const mongoose = require("mongoose");

// Leaderboard Model Data to track
const LeaderboardSchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true,
    },
    score: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);