import { checkSchema } from "express-validator";

export const userValidation = () =>
  checkSchema({
    email: {
      errorMessage: "Invalid email",
      isEmail: true,
    },
    password: {
      isLength: {
        options: { min: 8 },
        errorMessage: "Password should be at least 8 chars",
      },
    },
  });
