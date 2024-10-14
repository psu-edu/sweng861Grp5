import bcrypt from "bcrypt";
import mongoose, { type Document, Schema } from "mongoose";
import { logger } from "../../../shared/utils/logger";

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
	vitalUserId?: string;
	providers?: Provider[];
	comparePassword(password: string): Promise<boolean>;
}

export interface Provider {
	logo: string;
	name: string;
	slug: string;
	status: string;
	availability?: {};
}

const userSchema = new Schema({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	createdAt: { type: Date },
	updatedAt: { type: Date },
	providers: { type: Array<Provider> },
	vitalUserId: { type: String },
});

userSchema.pre("save", async function (next) {
	const user = this as IUser;

	if (!user.isModified("password")) return next();

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	logger.info(`Password hashed for user: ${user.email}`);
	next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (
	password: string,
): Promise<boolean> {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
