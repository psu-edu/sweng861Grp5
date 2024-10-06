import mongoose, { type Document, Schema, Connection } from "mongoose";

export interface IUserEntry extends Document {
    name: string;
    score: number;
    date: Date;
}

const userEntrySchema = new Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
    date: {type: Date, required: true }
});

export default function createUserEntryModel(connection: Connection) {
    return connection.model<IUserEntry>("UserEntry", userEntrySchema);
}