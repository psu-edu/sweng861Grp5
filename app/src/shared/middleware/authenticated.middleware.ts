import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve the JWT from the cookies
  const token = req.cookies?.jwt;

  logger.debug(`Authorizing... ${JSON.stringify(req.headers)}`);
  if (!token) {
    logger.warn("Token missing");
    return res.status(401).json({ error: "Authorization token missing" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    logger.debug(`Decoded token: ${JSON.stringify(decoded)}`);

    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    logger.warn("Invalid Token");
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authenticateJWT;
