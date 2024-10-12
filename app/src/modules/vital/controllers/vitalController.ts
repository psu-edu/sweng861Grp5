import { Vital, VitalClient, VitalEnvironment } from "@tryvital/vital-node";
import type { Request, Response } from "express";
import { logger } from "../../../shared/utils/logger";
import mqConnection from "../../../shared/utils/rabbitmq";

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

	async getProviders(req: Request, res: Response): Promise<void> {
		logger.info("Retrieving providers for userId...");
		try {
			const client = new VitalClient({
				apiKey: process.env.VITAL_API_KEY,
				environment: VitalEnvironment.Sandbox,
			});

			const data = await client.user.getConnectedProviders(req.params.vitalUserId!);

			const allData = {
				...data,
				vitalUserId: req.params.vitalUserId!
			}

			const message = {
					event: "VitalProviderConnected",
					data: allData,
				};

			mqConnection.sendToQueue("vital_user_queue", message);

			res.status(200).json(data);
			logger.info("Successfully retrieved vital providers");
		} catch (error: any) {
			logger.error(`Error retrieving providers for user: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}

	async getRemovalOfConnection(req: Request, res: Response): Promise<void> {
		logger.info("Reoving provider for userId...");
		try {
			const client = new VitalClient({
				apiKey: process.env.VITAL_API_KEY,
				environment: VitalEnvironment.Sandbox,
			});

			

			const data = await client.user.deregisterProvider(
    req.params.vitalUserId!,
    req.params.provider! as Vital.Providers
);

const allData = {
				...data,
				vitalUserId: req.params.vitalUserId!
			}

			const message = {
					event: "VitalProviderRemoved",
					data: allData,
				};

			mqConnection.sendToQueue("vital_user_queue", message);

			res.status(200).json(data);
			logger.info("Successfully removed vital provider");
		} catch (error: any) {
			logger.error(`Error retmoving provider for user: ${error.message}`);
			res.status(400).json({ error: error.message });
		}
	}
}

export default new VitalController();
