import { body } from "express-validator";

export const validateLogin = [
	body("email")
		.isString()
		.withMessage("Email must be a string")
		.notEmpty()
		.withMessage("Email is required"),

	body("password")
		.isString()
		.withMessage("Password must be a valid string")
		.notEmpty()
		.withMessage("Password is required"),
];
