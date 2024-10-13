import { body } from "express-validator";

export const validateLeaderboardEntry = [
	body("name")
		.isString()
		.withMessage("Name must be a string")
		.notEmpty()
		.withMessage("Name is required"),

	body("score")
		.isInt()
		.withMessage("score must be a valid integer")
		.notEmpty()
		.withMessage("score integer is required"),
];