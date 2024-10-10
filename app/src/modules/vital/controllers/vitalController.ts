import { VitalClient, VitalEnvironment } from "@tryvital/vital-node";
import type { Request, Response } from "express";
import { logger } from "../../../shared/utils/logger";

class VitalController {
	async getToken(req: Request, res: Response): Promise<void> {
		logger.info("Exchanging userId for VitalToken...");
		try {
			const client = new VitalClient({
				apiKey: process.env.VITAL_API_KEY,
				environment: VitalEnvironment.Sandbox,
			});

			const data = await client.link.token({ userId: req.params.vitalUserId! });

			res.status(200).json(data);
			logger.info("Successfully exchanged vital token");
		} catch (error: any) {
			logger.error(`Error exchanging id for token: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}
}

export default new VitalController();
