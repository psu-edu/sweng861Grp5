import mongoose, { type Document, Schema, Connection } from "mongoose";

export interface ILeaderboardEntry extends Document {
	name: string;
	score: number;
	date: Date;
	userId: string;
	teamId: string;
}

const leaderboardEntrySchema = new Schema({
	name: { type: String, required: true },
	score: { type: Number, required: true },
	teamId: { type: String, required: true },
	userId: { type: String, required: true },
	date: { type: Date, required: true },
});

leaderboardEntrySchema.index({ teamId: 1 });

const LeaderboardEntry = mongoose.model<ILeaderboardEntry>(
	"LeaderboardEntry",
	leaderboardEntrySchema,
);
export default LeaderboardEntry;
