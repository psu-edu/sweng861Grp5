import mongoose, { type Document, Schema } from "mongoose";

export interface IGoal extends Document {
  name: string;
  email: string;
  password: string;
}

const goalSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, unique: true },
});

const Goal = mongoose.model<IGoal>("Goal", goalSchema);

export default Goal;
