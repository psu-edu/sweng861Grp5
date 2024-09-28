import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UserService from "../services/userService";
import { IUser } from "../models/user";
import { logger } from "../../../shared/utils/logger";

// Serialize user to store user information in the session
passport.serializeUser((user: Partial<IUser>, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (user: IUser, done: any) => {
  const userId = user.id;
  try {
    const user = await UserService.getUserById(userId);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Local strategy for login
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await UserService.authenticateUser(email, password);
        if (!user) {
          logger.error("Incorrect email or password entered");
          return done(null, false, { message: "Incorrect email or password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export default passport;
