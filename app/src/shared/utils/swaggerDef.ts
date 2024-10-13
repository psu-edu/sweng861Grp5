import { application } from "./constants";

export const swaggerOptions = (
  title = "BitFit API",
  version = "1.0.0",
  description = "API Documentation for BitFit",
) => {
  return {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title,
        version,
        description,
      },
      servers: [
        {
          url: `http://localhost:${application.PORT}`, // Dynamically use the port from constants
        },
      ],
      components: {
        schemas: {
          Goal: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "Step Count",
              },
              goalInt: {
                type: "integer",
                example: 10000,
              },
              interval: {
                type: "string",
                enum: ["daily", "weekly", "monthly"],
                example: "weekly",
              },
            },
          },
        },
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "jwt",
          },
        },
        security: [
          {
            cookieAuth: [],
          },
        ],
      },
    },
    apis: ["./src/modules/**/routes/*.ts"], // Path to your API route files
  };
};
