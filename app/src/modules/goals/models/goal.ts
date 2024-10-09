import mongoose, { type Document, Schema } from "mongoose";

export interface IGoal extends Document {
	name: string;
	createdAt: Date;
	updatedAt?: Date;
	goalInt: number;
	teamId: string;
	userId: string;
	interval: string;
}

const goalSchema = new Schema({
	name: { type: String, required: true },
	createdAt: { type: Date },
	updatedAt: { type: Date },
	goalInt: { type: Number, required: true },
	userId: { type: String, required: true },
	teamId: { type: String, required: true },
	interval: { type: String, required: true },
});

goalSchema.index({ teamId: 1 });

const Goal = mongoose.model<IGoal>("Goal", goalSchema);

export default Goal;
