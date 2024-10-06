import { body } from "express-validator";

export const validateGoal = [
	body("name")
		.isString()
		.withMessage("Name must be a string")
		.notEmpty()
		.withMessage("Name is required"),

	body("goalInt")
		.isInt()
		.withMessage("Goal integer must be a valid integer")
		.notEmpty()
		.withMessage("Goal integer is required"),

	body("interval")
		.isString()
		.withMessage("Must be a string")
		.notEmpty()
		.withMessage("Cannot be empty")
		.isIn(["daily", "weekly", "monthly"])
		.withMessage("Must be daily, weekly, or monthly"),
];
