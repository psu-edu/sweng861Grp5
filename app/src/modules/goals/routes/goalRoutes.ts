import { Router } from "express";
import GoalController from "../controllers/goalController";
import { goalValidation } from "../validators/goalValidator";

const router = Router();

router.get("/goal", GoalController.getGoals);
router.get("/goal/:id", GoalController.getGoal);
router.post("/goal", goalValidation(), GoalController.createGoal);
router.patch("/goal/:id", goalValidation(), GoalController.updateGoal);
router.delete("/goal/:id", GoalController.deleteGoal);

export default router;
