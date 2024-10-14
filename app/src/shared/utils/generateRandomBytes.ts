import * as crypto from "node:crypto";

export const generateRandomBytes = (size: number): string => {
	return crypto.randomBytes(size).toString("hex");
};
