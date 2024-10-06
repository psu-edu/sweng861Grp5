import { Router } from "express";
import LeaderboardController from "../controllers/leaderboardController";
import LeaderboardService from "../services/leaderboardService";
import { userEntryValidation } from "../validators/userEntryValidator";
import { leaderboardsDB } from "../../../shared/utils/db";

const router = Router();
const leaderboardService = new LeaderboardService(leaderboardsDB);
const leaderboardController = new LeaderboardController(leaderboardService);

router.get("/leaderboard", leaderboardController.getAllLeaderboard.bind(leaderboardController));
router.get("/leaderboard/:id", leaderboardController.getLeaderboardEntry.bind(leaderboardController));
router.post("/userEntry", leaderboardController.createLeaderboardEntry.bind(leaderboardController));
router.patch("/userEntry/:id", leaderboardController.updateLeaderboardEntry.bind(leaderboardController));
router.delete("/userEntry/:id", leaderboardController.deleteLeaderboardEntry.bind(leaderboardController));

export default router;