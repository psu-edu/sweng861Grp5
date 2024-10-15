import mongoose, { Connection, type Document, Schema } from "mongoose";

export interface ILeaderboardEntry extends Document {
	name: string;
	userId: string;
	teamId: string;
	createdAt?: Date;
	updatedAt?: Date;
	goalId: string;
}

const leaderboardEntrySchema = new Schema({
	name: { type: String, required: true },
	teamId: { type: String, required: true },
	userId: { type: String, required: true },
	createdAt: { type: Date },
	updatedAt: { type: Date },
	goalId: { type: String, required: true },
});

leaderboardEntrySchema.index({ teamId: 1 });

const LeaderboardEntry = mongoose.model<ILeaderboardEntry>(
	"Leaderboard",
	leaderboardEntrySchema,
);
export default LeaderboardEntry;
