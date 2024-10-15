import { body } from "express-validator";

export const validateGoal = [
	body("name")
		.isString()
		.withMessage("Name must be a string")
		.notEmpty()
		.withMessage("Name is required"),

	body("interval")
		.isString()
		.withMessage("Must be a string")
		.notEmpty()
		.withMessage("Cannot be empty")
		.isIn(["daily", "weekly", "monthly"])
		.withMessage("Must be daily, weekly, or monthly"),
];
