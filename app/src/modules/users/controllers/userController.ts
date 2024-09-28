import { NextFunction, Request, Response } from "express";
import UserService from "../services/userService";
import { IUser } from "../models/user";
import { logger } from "../../../shared/utils/logger";
import passport from "passport";
import mongoose from "mongoose";

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      logger.info("User signup request received.");
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
      logger.info(`User successfully created: ${user.email}`);
    } catch (error: any) {
      logger.error(`Error creating user: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID format" });
    }

    try {
      logger.info("User get profile request received.");
      const user = await UserService.getUserById(userId);
      if (!user) {
        logger.warn(`User not found with ${req.params.id}`);
        res.status(404).json({ error: "No User Found" });
      } else {
        res.status(201).json(user);
        logger.info(`User successfully retrieved: ${user.email}`);
      }
    } catch (error: any) {
      logger.error(`Error retrieving user: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  loginUser(req: Request, res: Response, next: NextFunction): void {
    logger.info("User login request received.");

    passport.authenticate("local", (err: any, user: IUser, info: any) => {
      if (err) {
        logger.error(`Error during login: ${err.message}`);
        return next(err);
      }

      if (!user) {
        logger.warn("Login failed - invalid credentials.");
        return res.status(400).json({ error: info.message });
      }

      req.logIn(user, (err) => {
        if (err) {
          logger.error(`Error logging in user: ${err.message}`);
          return next(err);
        }

        logger.info(`User logged in: ${user.email}`);
        return res.json({ message: "Logged in successfully", user });
      });
    })(req, res, next);
  }

  logoutUser(req: Request, res: Response): void {
    logger.info("User logout request received.");

    req.logout((err) => {
      if (err) {
        logger.error(`Error logging out user: ${err.message}`);
        return res.status(500).json({ error: "Failed to logout" });
      }

      logger.info("User logged out successfully.");
      res.json({ message: "Logged out successfully" });
    });
  }
}

export default new UserController();
