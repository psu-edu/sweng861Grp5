import { body } from "express-validator";

export const validateGoal = [
	// Validate the 'name' field (required, must be a string with minimum length of 1)
	body("name")
		.isString()
		.withMessage("Name must be a string")
		.notEmpty()
		.withMessage("Name is required"),

	// Validate the 'date' field (required, must be a valid ISO8601 date)
	body("date")
		.isISO8601()
		.withMessage("Date must be a valid ISO8601 date")
		.notEmpty()
		.withMessage("Date is required"),

	// Validate the 'goalInt' field (required, must be an integer)
	body("goalInt")
		.isInt()
		.withMessage("Goal integer must be a valid integer")
		.notEmpty()
		.withMessage("Goal integer is required"),

	// Validate the 'teamId' field (required, must be a non-empty string)
	body("teamId")
		.isString()
		.withMessage("Team ID must be a string")
		.notEmpty()
		.withMessage("Team ID is required"),
];
