import { Router } from "express";
import GoalController from "../controllers/goalController";
import { validateGoal } from "../validators/goalValidator";

const router = Router();

router.get("/goal", GoalController.getGoals);
router.get("/goal/:id", GoalController.getGoal);
router.post("/goal", validateGoal, GoalController.createGoal);
router.patch("/goal/:id", validateGoal, GoalController.updateGoal);
router.delete("/goal/:id", GoalController.deleteGoal);

export default router;
