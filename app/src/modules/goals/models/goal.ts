import mongoose, { type Document, Schema } from "mongoose";

export interface IGoal extends Document {
  name: string;
  date: Date;
  goalInt: number;
  teamId: string;
}

const goalSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  goalInt: { type: Number, required: true },
  teamId: { type: String, required: true },
});

goalSchema.index({ teamId: 1 });

const Goal = mongoose.model<IGoal>("Goal", goalSchema);

export default Goal;
