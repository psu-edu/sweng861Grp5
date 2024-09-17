const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const Leaderboard = require("./models/LeaderboardSchema");
dotenv.config();
const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 3000;

// Setup CRUD Operations for the Leaderboard API

app.post("/api/leaderboard", async (req, res) => {
    const { name, score, location, img } = req.body;
    if (!name || !score || !location || !img) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
        const newScore = new Leaderboard({
            name,
            score,
            location,
            img
        });
        const scoreSaved = await newScore.save();
        res.json(scoreSaved);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "server Error" });
    }
});

app.get("/api/leaderboard", async (req, res) => {
    // Display the highest score first with a limit of 10
    try {
        const entries = await Leaderboard.find().sort({ entries: -1 }).limit(10);
        res.json(entries);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

app.delete("/api/leaderboard/:id", async (req, res) => {
    try {
        const entry = await Leaderboard.findByIdAndDelete(req.params.id);
        res.json(entry);
        if (!entry) return res.status(404).send({ msg: 'Entry not found' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Server Error" });
    }
})

app.put("/api/leaderboard/:id", async (req, res) => {
    try {
        const entry = await Leaderboard.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            });
        res.send(entry);
    } catch (error) {
        console.log(error)
        res.status(404).json({ msg: "Score not found" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});