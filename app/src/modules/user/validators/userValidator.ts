import { body } from "express-validator";

export const validateUser = [
	body("username")
		.isString()
		.withMessage("Userame must be a string")
		.notEmpty()
		.withMessage("Username is required"),

	body("email")
		.isEmail()
		.withMessage("Email must be a valid email")
		.notEmpty()
		.withMessage("Email is required"),

	body("password")
		.isString()
		.withMessage("Password must be a string")
		.notEmpty()
		.withMessage("Password cannot be empty")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long")
		.matches(/[A-Z]/)
		.withMessage("Password must contain at least one uppercase letter")
		.matches(/[a-z]/)
		.withMessage("Password must contain at least one lowercase letter")
		.matches(/[0-9]/)
		.withMessage("Password must contain at least one number")
		.matches(/[\W_]/)
		.withMessage("Password must contain at least one special character"),
];
