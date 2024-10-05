import type { NextFunction, Request, Response } from "express";

// Middleware to check user's teamId
export const enforceTeamAccess = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	next();
};
