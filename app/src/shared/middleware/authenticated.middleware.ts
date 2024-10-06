import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    // @ts-ignore
    req.userId = decoded.id;
    next();
  } catch (error: any) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authenticateJWT;
