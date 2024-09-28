import { Router } from "express";
import UserController from "../controllers/userController";
import { userValidation } from "../validators/userValidator";

const router = Router();

router.get("/users/:id", UserController.getUser);
router.post("/users", userValidation(), UserController.createUser);
router.post("/users/login", UserController.loginUser);
router.post("/users/logout", UserController.logoutUser);

export default router;
